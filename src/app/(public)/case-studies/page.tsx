import { getEntries } from '@/lib/content';
import { Breadcrumbs, EntryCard, CTA } from '@/components/shared';
export const metadata = {
  title: 'Case Studies',
  description: 'Explore the thinking, challenges, and engineering behind project concepts.',
  alternates: { canonical: '/case-studies' },
};
export default async function CaseStudies() {
  const entries = await getEntries('projects');
  return (
    <>
      <div className="container page-head">
        <Breadcrumbs title="Case studies" />
        <span className="eyebrow">BEHIND THE BUILD</span>
        <h1>
          The decisions that
          <br />
          make a product.
        </h1>
        <p>A closer look at problems, design choices, and technical approaches.</p>
      </div>
      <section className="container directory">
        {entries.some((e) => e.sample) && (
          <div className="notice">
            These sample case studies illustrate the content format. They do not claim real client
            results or performance improvements.
          </div>
        )}
        <div className="grid-3">
          {entries.map((e) => (
            <EntryCard entry={e} key={e.id} />
          ))}
        </div>
        {!entries.length && <p>Case studies will appear when projects are published.</p>}
      </section>
      <CTA />
    </>
  );
}
