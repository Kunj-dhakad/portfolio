import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getEntry, getEntries, getSettings } from '@/lib/content';
import { kinds, type Kind } from '@/types';
import {
  Breadcrumbs,
  ExternalCTA,
  FeatureList,
  EntryCard,
  SectionHeading,
} from '@/components/shared';
import { siteUrl } from '@/lib/utils';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  if (!kinds.includes(section as Kind)) return {};
  const entry = await getEntry(section as Kind, slug);
  if (!entry) return {};
  return {
    title: entry.data.seoTitle || entry.title,
    description: entry.data.seoDescription || entry.description,
    alternates: { canonical: `/${section}/${slug}` },
    openGraph: {
      title: entry.title,
      description: entry.description,
      type: section === 'blog' ? 'article' : 'website',
      images: [entry.data.cover],
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.title,
      description: entry.description,
      images: [entry.data.cover],
    },
  };
}
function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
export default async function Detail({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  if (!kinds.includes(section as Kind)) notFound();
  const kind = section as Kind;
  const entry = await getEntry(kind, slug);
  if (!entry) notFound();
  const [entries, settings] = await Promise.all([getEntries(kind), getSettings()]);
  const related = entries.filter((e) => e.slug !== slug).slice(0, 3);
  const d = entry.data;
  const tool = kind === 'tools';
  const headings = [...d.body.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  const schema =
    kind === 'blog'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: entry.title,
          description: entry.description,
          image: `${siteUrl()}${d.cover}`,
          datePublished: d.publishedAt,
          dateModified: entry.updatedAt,
          author: { '@type': 'Person', name: d.author },
          mainEntityOfPage: `${siteUrl()}/${kind}/${slug}`,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: entry.title,
          description: entry.description,
          url: `${siteUrl()}/${kind}/${slug}`,
        };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <div className="container page-head detail-page-head">
        <Breadcrumbs title={entry.title} section={kind} />
        <div className="detail-heading-grid">
          <div className="detail-heading-copy">
            <span className="eyebrow">
              {entry.category}
              {entry.sample ? ' · SAMPLE CONTENT' : ''}
            </span>
            <h1>{entry.title}</h1>
            <p>{entry.description}</p>
            {kind === 'blog' ? (
              <p className="sample-note">
                {d.author} ·{' '}
                {new Date(`${d.publishedAt}T12:00:00Z`).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}{' '}
                · {Math.max(1, Math.ceil(d.body.split(/\s+/).length / 200))} min read
              </p>
            ) : (
              <div className="button-row">
                <ExternalCTA url={d.demoUrl} label="Launch live demo" />
                <ExternalCTA
                  url={d.liveUrl || d.productUrl}
                  label={kind === 'products' ? 'Visit product' : 'Visit website'}
                />
                <ExternalCTA url={d.githubUrl} label="View source" />
                {tool && (
                  <ExternalCTA
                    url={d.affiliateUrl || d.officialUrl}
                    label="Visit website"
                    sponsored={!!d.affiliateUrl}
                  />
                )}
                <Link
                  className="button button-outline button-sm"
                  href={kind === 'products' ? `/contact?product=${slug}` : '/contact'}
                >
                  {kind === 'products' ? 'Request access' : 'Discuss a similar project'}
                </Link>
              </div>
            )}
          </div>
          {tool ? (
            <aside className="tool-heading-panel" aria-label={`${entry.title} quick overview`}>
              <div className="tool-heading-identity">
                <div className={`tool-logo logo-${entry.slug}`}>
                  {d.logo ? (
                    <Image src={d.logo} width={64} height={64} alt={`${entry.title} logo`} />
                  ) : (
                    entry.title.slice(0, 1)
                  )}
                </div>
                <div>
                  <strong>{entry.title}</strong>
                  <span>{entry.category}</span>
                </div>
              </div>
              <div className="tool-heading-description">{entry.description}</div>
              <div className="heading-facts">
                <div>
                  <span>Listing</span>
                  <strong>{entry.sample ? 'Editorial sample' : d.status}</strong>
                </div>
                <div>
                  <span>Pricing</span>
                  <strong>{d.pricing || 'See official website'}</strong>
                </div>
              </div>
            </aside>
          ) : (
            <div className="detail-heading-media">
              <Image
                src={d.cover || '/previews/workspace.svg'}
                alt={`${entry.title} ${entry.sample ? 'illustrative ' : ''}preview`}
                width={900}
                height={560}
                priority
              />
              <div>
                <span>{entry.category}</span>
                <span>{entry.sample ? 'Concept preview' : d.status}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="container">
        {entry.sample && (
          <div className="notice">
            {tool
              ? 'This is a sample editorial listing. It is not a first-hand review or an assertion of a commercial partnership.'
              : kind === 'blog'
                ? 'This is an editable sample article, provided to demonstrate the publishing system.'
                : 'This is an illustrative product concept. It does not represent a completed client engagement or a currently available product.'}
          </div>
        )}
        <div className="detail-layout">
          <article className="prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {d.body}
            </ReactMarkdown>
            {d.features.length > 0 && (
              <>
                <h2>Key features</h2>
                <FeatureList items={d.features} />
              </>
            )}
            {d.benefits.length > 0 && (
              <>
                <h2>Why it matters</h2>
                <FeatureList items={d.benefits} />
              </>
            )}
            {d.challenges && (
              <>
                <h2>The challenge</h2>
                <p>{d.challenges}</p>
              </>
            )}
            {d.solutions && (
              <>
                <h2>The approach</h2>
                <p>{d.solutions}</p>
              </>
            )}
            {tool && (
              <>
                <h2>Considerations</h2>
                <h3>Potential advantages</h3>
                <FeatureList items={d.pros} />
                <h3>Limitations to evaluate</h3>
                <FeatureList items={d.cons} />
                <h2>Pricing</h2>
                <p>{d.pricing || 'Visit the official website for current pricing.'}</p>
              </>
            )}
          </article>
          <aside className="detail-sidebar">
            <div>
              <h3>
                {kind === 'blog' ? 'In this article' : tool ? 'Tool overview' : 'At a glance'}
              </h3>
              {kind === 'blog' ? (
                <nav className="toc" aria-label="Table of contents">
                  {headings.map((h) => (
                    <a href={`#${headingId(h)}`} key={h}>
                      {h}
                    </a>
                  ))}
                </nav>
              ) : (
                <>
                  <dl>
                    <dt>Category</dt>
                    <dd>{entry.category}</dd>
                    <dt>Status</dt>
                    <dd>{d.status}</dd>
                    {d.projectType && (
                      <>
                        <dt>Project type</dt>
                        <dd>{d.projectType}</dd>
                      </>
                    )}
                    {d.audience && (
                      <>
                        <dt>Built for</dt>
                        <dd>{d.audience}</dd>
                      </>
                    )}
                    {d.pricing && !tool && (
                      <>
                        <dt>Pricing</dt>
                        <dd>{d.pricing}</dd>
                      </>
                    )}
                  </dl>
                  {d.technologies.length > 0 && (
                    <>
                      <h3 style={{ marginTop: 25 }}>Technology</h3>
                      <div className="tags">
                        {d.technologies.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            {tool && (d.disclosure || d.affiliateUrl) && (
              <div>
                <h3>Affiliate disclosure</h3>
                <p>{settings.disclosure}</p>
                <Link href="/affiliate-disclosure" className="text-link">
                  Read the full disclosure
                </Link>
              </div>
            )}
            <div>
              <h3>Let’s build your idea.</h3>
              <p>A focused conversation is the first step towards a useful product.</p>
              <Link href="/contact" className="button button-primary">
                Discuss your project
              </Link>
            </div>
          </aside>
        </div>
        {d.screenshots.length > 0 && (
          <>
            <SectionHeading eyebrow="A CLOSER LOOK" title="Inside the experience" />
            <div className="gallery">
              {d.screenshots.map((src, i) => (
                <a
                  href={src}
                  key={`${src}-${i}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open screenshot ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${entry.title} screenshot ${i + 1}`}
                    width={900}
                    height={560}
                  />
                </a>
              ))}
            </div>
          </>
        )}
        {related.length > 0 && (
          <section className="section">
            <SectionHeading
              eyebrow="KEEP EXPLORING"
              title={kind === 'blog' ? 'More from the journal' : 'You might also explore'}
            />
            <div className="grid-3">
              {related.map((e) => (
                <EntryCard key={e.id} entry={e} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
