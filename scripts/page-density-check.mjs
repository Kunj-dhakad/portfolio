import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
try {
  const page = await browser.newPage({ viewport: { width: 1365, height: 760 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  const routes = [
    '/projects',
    '/products',
    '/tools',
    '/blog',
    '/projects/orbit',
    '/products/orbit-workspace',
    '/tools/notion',
    '/blog/from-idea-to-a-focused-saas-mvp',
    '/services',
    '/case-studies',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/affiliate-disclosure',
  ];
  for (const width of [1365, 768, 375]) {
    await page.setViewportSize({ width, height: 760 });
    for (const route of routes) {
      await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle' });
      await expect(page.locator('main h1')).toHaveCount(1);
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
        throw new Error(`${route}: overflow at ${width}`);
      const gap = await page.evaluate(
        () =>
          document.querySelector('.page-head').getBoundingClientRect().top -
          document.querySelector('.site-header').getBoundingClientRect().bottom,
      );
      if (gap > 30) throw new Error(`${route}: excessive header gap`);
      if (width === 1365 && route === '/tools/notion') {
        await expect(page.locator('.tool-heading-panel')).toBeVisible();
        if (
          (await page.locator('.detail-layout').evaluate((el) => el.getBoundingClientRect().top)) >
          650
        )
          throw new Error('Tool content remains too far below the fold');
        await page.screenshot({ path: '.local-test/notion-compact.png', animations: 'disabled' });
      }
    }
  }
  await page.setViewportSize({ width: 1365, height: 760 });
  await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });
  await expect(page.locator('.collection-overview')).toBeVisible();
  await page.screenshot({ path: '.local-test/products-compact.png', animations: 'disabled' });
  if (errors.length) throw new Error(errors.join('; '));
  console.log(
    'Page composition passed: 15 public page types at desktop, tablet, and mobile; no overflow, compact header gaps, visible detail overview, and no browser errors.',
  );
} finally {
  await browser.close();
}
