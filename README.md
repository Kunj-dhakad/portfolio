# Navonixx Studio

A light-first Navonixx product studio website combining a portfolio, SaaS collection, software toolkit, journal, service offering, and private content dashboard. Uses the supplied Navonixx logo, blue accents, sculpted neumorphic shadows, floating previews, scroll reveals, and reduced-motion support. Built with Next.js App Router, strict TypeScript, React, Tailwind CSS, Radix/shadcn-style primitives, Lucide, Motion, React Hook Form, Zod, PostgreSQL, and Prisma.

## Quick start

Use Node.js 22.12+ or 24 LTS.

```powershell
npm install
Copy-Item .env.example .env
npm run db:generate
npm run dev
```

Open http://localhost:3000. With no `DATABASE_URL`, public pages use centralized samples from `src/data/content.ts`. This is a preview mode: admin and enquiry persistence require a database. A configured but unavailable database produces an error rather than silently serving unrelated sample data.

## Enable persistence and administration

1. Create a PostgreSQL database with a provider or local installation.
2. Set `DATABASE_URL` in `.env`. Use a provider-recommended TLS connection string for remote databases.
3. Generate an authentication secret with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` and set `AUTH_SECRET`.
4. Apply the checked-in migration and seed content:

```powershell
npm run db:migrate
npm run db:seed
```

5. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 14 characters in `.env`, then run:

```powershell
npm run admin:create
```

6. Remove `ADMIN_PASSWORD` from `.env` after account creation. Visit `/admin/login`.

There are no default accounts or embedded credentials. Administrator passwords are bcrypt hashes; sessions are signed, HTTP-only, SameSite Strict cookies with an eight-hour lifetime. Production cookies require HTTPS. Every admin mutation authenticates the user and validates the request origin and body independently of the protected page layout.

The seed creates 6 projects, 4 products, 8 software tools, and 6 blog posts. Seven service descriptions are centralized in `src/data/content.ts`. All seed content is labelled as sample content. The seed is idempotent and preserves edits to existing slugs. Remove or replace samples before publishing professional claims. Empty demo and affiliate URLs intentionally hide those calls to action.

## Content management

The admin dashboard supports create/edit/delete, publishing, featured flags, sample flags, screenshot paths, URLs, pricing descriptions, Markdown articles, SEO fields, and affiliate disclosures. Projects, products, tools, and articles share an indexed content table with validated, typed JSON-specific fields. Enquiries have separate private records and statuses: New, Reviewed, Contacted, Archived.

Place images in `public/` and configure local image paths in the dashboard. Three bundled SVG dashboard previews are self-contained and avoid unreliable remote images. Add gallery paths one per line. The hero uses a functional HTML interface composition; its data is explicitly illustrative.

Markdown is rendered without raw HTML support; unsafe URL schemes are rejected. A configured affiliate URL uses `rel="sponsored noopener noreferrer"`; official and demo links use `noopener noreferrer` and open in a new tab. Published records alone appear publicly and in the sitemap.

Brand, logo path, headline, description, contact address, social links, SEO defaults, and affiliate disclosure are editable in Settings. The public navigation and footer use those values. Testimonials are intentionally absent until authentic content is supplied.

## Enquiries and optional notifications

Enquiries are validated on the client and server, bounded in size, protected by a honeypot, and limited to five submissions per request identifier per hour. Login attempts are limited by both identifier and account. Rate limits use PostgreSQL atomic upserts and survive process restarts. Configure your trusted reverse proxy to replace `X-Forwarded-For`; do not pass through client-supplied values. Deploy behind provider-level abuse protection for an additional network boundary. Periodically clean expired limiter rows with `DELETE FROM "RateLimit" WHERE "expiresAt" < NOW();`.

For email notifications, set `RESEND_API_KEY`, `NOTIFICATION_FROM` (a verified sender), and `NOTIFICATION_TO`. An email outage does not lose a saved enquiry. Email delivery is best-effort; the private enquiry dashboard remains the source of truth. No email is sent by default.

Optional analytics accepts an HTTPS script through `NEXT_PUBLIC_ANALYTICS_SCRIPT`. Configure appropriate privacy copy and consent for your chosen provider before enabling it. Policy pages are visibly marked templates and require owner review.

## Validation

```powershell
npm run typecheck
npm test
npm run build
node scripts/browser-check.mjs
```

Browser checks require the dev server and an installed Playwright Chromium (`npx playwright install chromium`). They test public routes, search/filtering, client validation, protected redirects, mobile navigation, theme switching, and layout overflow at three widths. `scripts/integration-check.mjs` provides an isolated real PostgreSQL smoke test using test-only embedded PostgreSQL; it creates temporary test credentials, never touches the configured production database, and verifies persistence and authorization.

## Deployment

Deploy as a Node.js application on Vercel or another Next.js-compatible provider; this application is not a static export.

1. Provision PostgreSQL, deploy the repository, and install dependencies with `npm ci`.
2. Configure `DATABASE_URL`, `AUTH_SECRET`, and the final HTTPS `NEXT_PUBLIC_SITE_URL`. Optional notification and analytics settings are listed in `.env.example`.
3. Run `npm run db:migrate` against the deployment database in a controlled release step. Run the seed only if sample content is wanted.
4. Create the administrator with `npm run admin:create` in a trusted environment pointing at the deployment database. Remove the temporary plaintext password environment value afterwards.
5. Build with `npm run build`. A standalone Node deployment starts with `npm start`; Vercel supplies the runtime.
6. Configure HTTPS, trusted proxy headers, database backups, monitoring, and the chosen data retention period. Replace samples, update the policy templates, and verify the contact form and admin login on the final origin.

Never commit `.env` or print credentials. Prisma generation runs during builds. Use a pooled connection string if recommended by the database provider, and monitor database connections when scaling server instances.

## Structure

- `src/app/(public)` — public listings, detail pages, services, biography, contact, policies
- `src/app/admin` — login and protected content workspace
- `src/app/api` — validated authentication, content, settings, and enquiry handlers
- `src/components` — layout, cards, forms, hero, and admin interfaces
- `src/lib` — database, sessions, validation, rate limiting, content repository
- `src/data/content.ts` — labelled sample entries, settings defaults, services
- `prisma` — schema, checked-in SQL migration, and non-destructive seed
- `public/previews` — local dashboard illustrations

Versions were checked against npm and the official [Next.js App Router documentation](https://nextjs.org/docs/app/getting-started/installation) and [Prisma PostgreSQL documentation](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql). Prisma 7 is used because the npm `latest` tag currently points to a Prisma 8 release candidate. Patched transitive overrides address the dependency audit findings in Prisma's tooling dependencies.
