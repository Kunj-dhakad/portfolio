import type { MetadataRoute } from 'next';
import { getEntries } from '@/lib/content';
import { siteUrl } from '@/lib/utils';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = [
    '',
    'projects',
    'products',
    'tools',
    'services',
    'case-studies',
    'blog',
    'about',
    'contact',
    'privacy',
    'terms',
    'affiliate-disclosure',
  ];
  const entries = await getEntries();
  return [
    ...pages.map((p) => ({
      url: `${base}/${p}`,
      changeFrequency: 'monthly' as const,
      priority: p ? 0.7 : 1,
    })),
    ...entries.map((e) => ({
      url: `${base}/${e.kind}/${e.slug}`,
      lastModified: new Date(e.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
