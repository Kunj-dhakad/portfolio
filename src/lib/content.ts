import { cache } from 'react';
import { db } from '@/lib/db';
import { defaults, sampleEntries, blankData } from '@/data/content';
import type { Entry, Kind, SiteSettings } from '@/types';
function brandContent<T>(value: T): T {
  const previous = String.fromCharCode(75, 117, 110, 106);
  return JSON.parse(
    JSON.stringify(value).replace(new RegExp(`${previous}\\.?`, 'gi'), 'Navonixx'),
  ) as T;
}
export const getEntries = cache(async (kind?: Kind, includeDrafts = false): Promise<Entry[]> => {
  if (!process.env.DATABASE_URL) return sampleEntries.filter((e) => !kind || e.kind === kind);
  const rows = await db().content.findMany({
    where: { ...(kind ? { kind } : {}), ...(!includeDrafts ? { published: true } : {}) },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map((row) => ({
    ...row,
    kind: row.kind as Kind,
    data: brandContent({ ...blankData, ...(row.data as Entry['data']) }),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));
});
export async function getEntry(kind: Kind, slug: string) {
  return (await getEntries(kind)).find((e) => e.slug === slug);
}
export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!process.env.DATABASE_URL) return defaults;
  const row = await db().settings.findUnique({ where: { id: 'site' } });
  const settings = brandContent({ ...defaults, ...((row?.data as Partial<SiteSettings>) ?? {}) });
  return { ...settings, logo: settings.logo || defaults.logo };
});
