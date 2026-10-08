import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await expect(page.locator('.desktop-nav .nav-active-pill')).toHaveCount(1);
  await page.screenshot({ path: '.local-test/header-redesign.png', animations: 'disabled' });
  const samples = await page.evaluate(async () => {
    const seen = new WeakSet();
    const failures = [];
    const height = document.documentElement.scrollHeight;
    for (let position = 0; position < height; position += 100) {
      window.scrollTo({ top: position, behavior: 'instant' });
      await new Promise((resolve) => setTimeout(resolve, 90));
      document
        .querySelectorAll(
          '.section-heading, .entry-card, .service-card, .process-step, .product-feature, .cta-banner',
        )
        .forEach((element) => {
          const opacity = Number(getComputedStyle(element).opacity);
          if (seen.has(element) && opacity < 0.97)
            failures.push('A revealed element became transparent again');
          if (opacity > 0.995) seen.add(element);
        });
    }
    return failures;
  });
  if (samples.length) throw new Error(samples.join('; '));
  await page.locator('.footer').scrollIntoViewIfNeeded();
  await page.screenshot({ path: '.local-test/footer-redesign.png', animations: 'disabled' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(700);
  if (await page.locator('.reveal-pending').count())
    throw new Error('Revealed content was reset on scroll');
  await page.getByRole('link', { name: 'Products', exact: true }).first().click();
  await page.waitForURL('**/products');
  await expect(page.locator('.desktop-nav a[aria-current=page]')).toHaveText('Products');
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error(`Overflow at ${width}`);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.locator('#mobile-nav').getByRole('link', { name: 'Products', exact: true }).click();
  await page.waitForURL('**/products');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  if (await page.locator('.reveal-pending').count())
    throw new Error('Reduced-motion content hidden');
  if (errors.length) throw new Error(errors.join('; '));
  console.log(
    'Header/footer and scroll checks passed: no opacity resets, one-time reveals, active navigation, mobile menu, four widths, and reduced motion.',
  );
} finally {
  await browser.close();
}
