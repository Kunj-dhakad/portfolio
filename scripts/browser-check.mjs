import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
if (
  !(await page
    .locator('.brand')
    .first()
    .innerText()
    .then((text) => text.includes('Navonixx')))
)
  throw new Error('Brand was not updated');
await page.locator('.brand-image').first().waitFor();
mkdirSync('.local-test', { recursive: true });
await page.screenshot({ path: '.local-test/home-desktop.png', fullPage: true });
await page.screenshot({ path: '.local-test/home-first-screen.png', animations: 'disabled' });
const paths = [
  '/',
  '/projects',
  '/products',
  '/tools',
  '/blog',
  '/services',
  '/case-studies',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/affiliate-disclosure',
  '/admin/login',
  '/projects/orbit',
  '/products/orbit-workspace',
  '/tools/vercel',
  '/blog/from-idea-to-a-focused-saas-mvp',
  '/sitemap.xml',
  '/robots.txt',
  '/opengraph-image',
];
for (const path of paths) {
  const response = await page.request.get(base + path);
  if (response.status() !== 200) throw new Error(`${path}: ${response.status()}`);
  if (!path.includes('opengraph-image')) {
    const content = await response.text();
    if (new RegExp(String.fromCharCode(75, 117, 110, 106), 'i').test(content))
      throw new Error(`Legacy brand remains on ${path}`);
  }
}
await page.goto(`${base}/projects`);
await page.getByRole('textbox', { name: 'Search entries' }).fill('Orbit');
if ((await page.locator('.entry-card').count()) !== 1) throw new Error('Search filtering failed');
await page.getByRole('textbox', { name: 'Search entries' }).fill('');
await page.getByLabel('Filter by category').selectOption('AI Tools');
if ((await page.locator('.entry-card').count()) !== 1) throw new Error('Category filtering failed');
await page.goto(`${base}/contact`);
await page.getByRole('button', { name: 'Send project enquiry' }).click();
if ((await page.getByRole('alert').count()) < 4) throw new Error('Contact validation failed');
await page.goto(`${base}/admin`);
await page.waitForURL('**/admin/login');
for (const width of [375, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  if (overflow) throw new Error(`Horizontal overflow at ${width}px`);
  await page.screenshot({ path: `.local-test/home-${width}.png`, fullPage: true });
}
await page.setViewportSize({ width: 375, height: 812 });
await page.getByRole('button', { name: 'Open navigation' }).click();
await page.locator('#mobile-nav').getByRole('link', { name: 'Projects', exact: true }).click();
await page.waitForURL('**/projects');
await page.getByRole('button', { name: 'Toggle color theme' }).click();
await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
await page.getByRole('button', { name: 'Toggle color theme' }).click();
await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
await page.screenshot({ path: '.local-test/projects-mobile-light.png', fullPage: true });
if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
console.log(
  'Browser checks passed: 20 routes, search, filters, form validation, admin redirect, theme toggle, mobile menu, and three responsive widths.',
);
await browser.close();
