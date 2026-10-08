import 'dotenv/config';
import { db } from '../src/lib/db';
import { sampleEntries, defaults } from '../src/data/content';
async function main() {
  for (const entry of sampleEntries) {
    const { id, createdAt, updatedAt, ...data } = entry;
    void id;
    void createdAt;
    void updatedAt;
    await db().content.upsert({
      where: { kind_slug: { kind: entry.kind, slug: entry.slug } },
      create: data,
      update: {},
    });
  }
  await db().settings.upsert({
    where: { id: 'site' },
    create: { id: 'site', data: defaults },
    update: {},
  });
  console.log(
    'Seeded 6 projects, 4 products, 8 tools, and 6 articles. Existing content was preserved.',
  );
}
main()
  .catch(() => {
    console.error('Seeding failed. Check DATABASE_URL and apply migrations.');
    process.exitCode = 1;
  })
  .finally(async () => {
    if (process.env.DATABASE_URL) await db().$disconnect();
  });
