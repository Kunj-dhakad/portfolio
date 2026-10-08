import EmbeddedPostgres from 'embedded-postgres';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { resolve } from 'node:path';
import { chromium, expect } from '@playwright/test';
import { Client } from 'pg';
const token = randomBytes(8).toString('hex');
const pgPassword = randomBytes(24).toString('hex');
const adminPassword = randomBytes(24).toString('hex');
const port = 55439;
const base = 'http://localhost:3109';
const pg = new EmbeddedPostgres({
  databaseDir: resolve('.local-test', `pg-${token}`),
  user: 'postgres',
  password: pgPassword,
  port,
  persistent: true,
  postgresFlags: ['-h', '127.0.0.1'],
  onLog: () => {},
  onError: () => {},
});
const env = {
  ...process.env,
  DATABASE_URL: `postgresql://postgres:${pgPassword}@localhost:${port}/studio_test`,
  AUTH_SECRET: randomBytes(48).toString('hex'),
  ADMIN_EMAIL: 'admin@example.test',
  ADMIN_PASSWORD: adminPassword,
  NEXT_PUBLIC_SITE_URL: base,
  RESEND_API_KEY: '',
  NOTIFICATION_FROM: '',
  NOTIFICATION_TO: '',
};
async function run(args) {
  const child = spawn(process.execPath, args, { env, stdio: 'pipe' });
  let output = '';
  child.stdout.on('data', (c) => (output += c.toString()));
  child.stderr.on('data', (c) => (output += c.toString()));
  const [code] = await once(child, 'exit');
  if (code !== 0)
    throw new Error(
      `Command failed (${args[0]}): ${output.replaceAll(pgPassword, '[redacted]').replaceAll(adminPassword, '[redacted]')}`,
    );
}
let server, browser, pgClient;
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
async function assertUnpublished(api, url, title) {
  const response = await api.get(url);
  const html = await response.text();
  // Next.js streamed not-found pages may retain HTTP 200 after headers have been sent.
  assert(
    response.status() === 404 || (html.includes('A DETOUR') && html.includes('noindex')),
    'Unpublished page did not render a no-index not-found response',
  );
  assert(!html.includes(title), 'Unpublished content was included in the public response');
}
try {
  console.log('Starting isolated PostgreSQL checks.');
  await pg.initialise();
  await pg.start();
  await pg.createDatabase('studio_test');
  await run(['node_modules/prisma/build/index.js', 'migrate', 'deploy']);
  await run(['node_modules/tsx/dist/cli.mjs', 'prisma/seed.ts']);
  await run(['node_modules/tsx/dist/cli.mjs', 'scripts/create-admin.ts']);
  await run(['node_modules/tsx/dist/cli.mjs', 'scripts/export-test-seed.ts']);
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3109'], {
    env,
    stdio: 'pipe',
  });
  let serverErrors = '';
  server.stderr.on('data', (c) => (serverErrors += c.toString()));
  for (let i = 0; i < 80; i++) {
    try {
      const res = await fetch(base);
      if (res.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
    if (i === 79) throw new Error(`Test server not ready: ${serverErrors}`);
  }
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  });
  const context = await browser.newContext();
  const api = context.request;
  const post = (path, data, origin = base) => api.post(base + path, { headers: { origin }, data });
  let response = await post('/api/admin/content', {});
  assert(response.status() === 401, 'Anonymous admin mutation allowed');
  response = await post('/api/enquiries', {}, 'https://evil.example');
  assert(response.status() === 403, 'Cross-origin mutation allowed');
  const form = {
    name: 'Test Enquirer',
    email: 'visitor@example.test',
    company: 'Test studio',
    projectType: 'MVP development',
    budget: '$5,000–$15,000',
    description: 'A focused project management tool for a small creative studio.',
    timeline: '1–3 months',
    website: '',
    honeypot: '',
  };
  response = await post('/api/enquiries', { ...form, email: 'invalid' });
  assert(response.status() === 400, 'Invalid enquiry accepted');
  response = await post('/api/enquiries', { ...form, honeypot: 'bot' });
  assert(response.ok(), 'Honeypot handling failed');
  response = await post('/api/enquiries', form);
  assert(response.status() === 201, 'Enquiry not stored');
  const databaseCheck = new Client({ connectionString: env.DATABASE_URL });
  await databaseCheck.connect();
  const stored = await databaseCheck.query('SELECT name FROM "Enquiry"');
  await databaseCheck.end();
  assert(stored.rowCount === 1, `Expected one persisted enquiry; found ${stored.rowCount}`);
  response = await post('/api/auth', { email: 'admin@example.test', password: 'incorrect' });
  assert(response.status() === 401, 'Wrong password accepted');
  response = await post('/api/auth', { email: 'admin@example.test', password: adminPassword });
  assert(response.ok(), 'Valid login failed');
  const page = await context.newPage();
  await page.goto(base + '/admin');
  assert(
    (await page.getByRole('heading', { name: 'Studio overview' }).count()) === 1,
    'Admin dashboard inaccessible',
  );
  await page.goto(base + '/admin/enquiries');
  await page.getByRole('heading', { name: 'Test Enquirer' }).waitFor();
  await expect(page.locator('article.admin-enquiry')).toHaveCount(1);
  pgClient = new Client({ connectionString: env.DATABASE_URL });
  pgClient.on('error', () => {});
  await pgClient.connect();
  const query = await pgClient.query('SELECT id FROM "Enquiry"');
  const enquiryId = query.rows[0].id;
  response = await post('/api/admin/enquiries', { id: enquiryId, status: 'Contacted' });
  assert(response.ok(), 'Enquiry status update failed');
  const { sampleEntries, defaults } = await import('../.local-test/seed-export.mjs');
  for (const kind of ['projects', 'products', 'tools', 'blog']) {
    const entry = {
      ...sampleEntries.find((e) => e.kind === kind),
      title: `Integration ${kind}`,
      slug: `integration-${kind}`,
      published: false,
      sample: false,
    };
    response = await post('/api/admin/content', { entry });
    if (!response.ok()) throw new Error(`${kind} create failed: ${await response.text()}`);
    const { id } = await response.json();
    await assertUnpublished(api, `${base}/${kind}/${entry.slug}`, entry.title);
    entry.published = true;
    entry.data.demoUrl = kind === 'projects' ? 'https://example.com/demo' : '';
    entry.data.affiliateUrl = kind === 'tools' ? 'https://example.com/affiliate' : '';
    response = await post('/api/admin/content', { id, entry });
    assert(response.ok(), `${kind} publish failed`);
    const detail = await api.get(`${base}/${kind}/${entry.slug}`);
    assert(detail.ok(), `${kind} published page missing`);
    const html = await detail.text();
    if (kind === 'tools')
      assert(html.includes('sponsored noopener noreferrer'), 'Sponsored attributes missing');
    response = await post('/api/admin/content', { entry });
    assert(response.status() === 409, 'Duplicate slug accepted');
    response = await api.delete(base + '/api/admin/content', {
      headers: { origin: base },
      data: { id },
    });
    assert(response.ok(), `${kind} delete failed`);
    await assertUnpublished(api, `${base}/${kind}/${entry.slug}`, entry.title);
  }
  response = await post('/api/admin/settings', { ...defaults, brand: 'Integration Studio' });
  assert(response.ok(), 'Settings save failed');
  assert(
    (await (await api.get(base)).text()).includes('Integration Studio'),
    'Saved brand not shown',
  );
  await page.goto(base + '/admin/blog/new');
  await page.getByLabel('Title', { exact: true }).fill('Browser workflow article');
  await page.getByLabel('URL slug').fill('browser-workflow-article');
  await page.getByLabel('Category', { exact: true }).fill('Engineering');
  await page
    .getByLabel('Short description')
    .fill('An article created through the administrator content form.');
  await page
    .getByLabel('Article / full description (Markdown)')
    .fill('## Browser workflow\n\nThis article verifies the actual admin form.');
  await page.getByLabel('Published', { exact: true }).check();
  await page.getByRole('button', { name: 'Save content' }).click();
  await page.waitForURL(base + '/admin/blog');
  let articleRow = page.getByRole('row').filter({ hasText: 'Browser workflow article' });
  await expect(articleRow).toHaveCount(1);
  await articleRow.getByRole('link', { name: 'Edit', exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('Updated browser workflow article');
  await page.getByRole('button', { name: 'Save content' }).click();
  await page.waitForURL(base + '/admin/blog');
  articleRow = page.getByRole('row').filter({ hasText: 'Updated browser workflow article' });
  await articleRow.getByRole('button', { name: 'Delete', exact: true }).click();
  await articleRow.getByRole('button', { name: 'Confirm delete', exact: true }).click();
  await expect(articleRow).toHaveCount(0);
  response = await api.delete(base + '/api/admin/enquiries', {
    headers: { origin: base },
    data: { id: enquiryId },
  });
  assert(response.ok(), 'Enquiry deletion failed');
  for (let i = 0; i < 4; i++) await post('/api/enquiries', form);
  response = await post('/api/enquiries', form);
  assert(response.status() === 429, 'Public rate limit failed');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.waitForURL(base + '/admin/login');
  await page.getByLabel('Email', { exact: true }).fill('admin@example.test');
  await page.getByLabel('Password', { exact: true }).fill(adminPassword);
  await page.getByRole('button', { name: 'Sign in to dashboard' }).click();
  await page.waitForURL(base + '/admin');
  await pgClient.end();
  console.log(
    'Real PostgreSQL integration passed: migrations, seed, login, protected dashboard, CRUD for all four content types, draft privacy, affiliate attributes, settings, enquiry persistence/status/delete, honeypot, CSRF, and rate limiting.',
  );
} finally {
  if (pgClient) await pgClient.end().catch(() => {});
  if (browser) await browser.close();
  if (server) {
    server.kill();
    await once(server, 'exit').catch(() => {});
  }
  await pg.stop().catch(() => {});
}
