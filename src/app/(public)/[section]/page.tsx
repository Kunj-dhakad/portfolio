import { notFound } from 'next/navigation';
import { getEntries } from '@/lib/content';
import { kinds, type Kind } from '@/types';
import { Directory } from '@/components/directory';
import { Breadcrumbs, CTA } from '@/components/shared';
import Link from 'next/link';
const copy = {
  projects: [
    'THE PORTFOLIO',
    'Built with purpose.',
    'Explore software concepts, web applications, and the engineering behind them.',
  ],
  products: [
    'THE PRODUCT COLLECTION',
    'Useful software. Thoughtfully built.',
    'Independent SaaS products designed around real workflows and clear experiences.',
  ],
  tools: [
    'THE CURATED TOOLKIT',
    'Find the right tool for the job.',
    'Explore developer tools, design platforms, and software for a more productive workflow.',
  ],
  blog: [
    'THE JOURNAL',
    'Notes from the building process.',
    'Ideas on SaaS, software engineering, AI, and the craft of building better products.',
  ],
};
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!kinds.includes(section as Kind)) return {};
  return {
    title: section[0].toUpperCase() + section.slice(1),
    description: copy[section as Kind][2],
    alternates: { canonical: `/${section}` },
  };
}
export default async function Listing({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!kinds.includes(section as Kind)) notFound();
  const kind = section as Kind;
  const entries = await getEntries(kind);
  const [eyebrow, title, description] = copy[kind];
  return (
    <>
      <div className="container page-head listing-page-head">
        <Breadcrumbs title={kind} />
        <div className="listing-heading-grid">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <aside className="collection-overview" aria-label="Collection overview">
            <span className="eyebrow">EXPLORE THE COLLECTION</span>
            <div className="collection-count">
              <strong>{entries.length.toString().padStart(2, '0')}</strong>
              <span>
                {kind === 'blog'
                  ? 'articles & ideas'
                  : kind === 'tools'
                    ? 'software tools'
                    : kind === 'products'
                      ? 'product concepts'
                      : 'project listings'}
              </span>
            </div>
            <div className="collection-topics">
              {[...new Set(entries.map((e) => e.category))].slice(0, 3).map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>
      <section className="container directory">
        {entries.some((e) => e.sample) && (
          <div className="notice">
            These are editable sample {kind === 'blog' ? 'articles' : 'listings'}. Concept projects
            and products do not represent completed client work.
          </div>
        )}
        {kind === 'tools' && (
          <p className="sample-note" style={{ marginBottom: 20 }}>
            Affiliate links, when configured, may earn a commission.{' '}
            <Link className="text-link" href="/affiliate-disclosure">
              Read the affiliate disclosure.
            </Link>
          </p>
        )}
        <Directory entries={entries} />
      </section>
      {kind !== 'blog' && <CTA />}
    </>
  );
}
