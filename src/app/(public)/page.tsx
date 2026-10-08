import Link from 'next/link';
import Image from 'next/image';
import { Layers, Code2, Network, Sparkles, Workflow } from 'lucide-react';
import { Hero } from '@/components/home/hero';
import { SectionHeading, EntryCard, ServiceCard, CTA, FeatureList } from '@/components/shared';
import { getEntries, getSettings } from '@/lib/content';
import { services } from '@/data/content';
import { siteUrl } from '@/lib/utils';
export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: { absolute: settings.seoTitle },
    description: settings.seoDescription,
    alternates: { canonical: '/' },
  };
}
export default async function Home() {
  const [entries, settings] = await Promise.all([getEntries(), getSettings()]);
  const projects = entries.filter((e) => e.kind === 'projects' && e.featured).slice(0, 3);
  const products = entries.filter((e) => e.kind === 'products' && e.featured);
  const tools = entries.filter((e) => e.kind === 'tools').slice(0, 4);
  const posts = entries.filter((e) => e.kind === 'blog').slice(0, 3);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: settings.brand.replace('.', ''),
            url: siteUrl(),
            logo: `${siteUrl()}/brand/navonixx-logo.png`,
            knowsAbout: ['SaaS Development', 'Web Applications', 'AI Integrations'],
          }).replace(/</g, '\\u003c'),
        }}
      />
      <Hero settings={settings} />
      <section className="expertise-strip">
        <div className="container expertise-inner">
          <span className="expertise-label">
            THE RIGHT EXPERTISE.
            <br />
            FROM IDEA TO LAUNCH.
          </span>
          <div className="expertise-items">
            <span>
              <Layers />
              SaaS development
            </span>
            <span>
              <Code2 />
              Full-stack engineering
            </span>
            <span>
              <Network />
              API integrations
            </span>
            <span>
              <Sparkles />
              AI applications
            </span>
            <span>
              <Workflow />
              Automation
            </span>
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="SELECTED WORK"
          title="Built to solve. Designed to delight."
          description="A collection of products and experiences at the intersection of thoughtful design and solid engineering."
          href="/projects"
          label="All projects"
        />
        <div className="grid-3">
          {projects.map((e) => (
            <EntryCard entry={e} key={e.id} />
          ))}
        </div>
        {projects.some((e) => e.sample) && (
          <p className="sample-note">
            Illustrative portfolio concepts. Replace these editable samples with your own projects.
          </p>
        )}
      </section>
      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="INDEPENDENT PRODUCTS"
            title="Small ideas. Big possibilities."
            description="Purpose-built software for clearer work and better everyday workflows."
            href="/products"
            label="All products"
          />
          {products[0] ? (
            <div className="product-feature">
              <div>
                <span className="eyebrow">
                  {products[0].category} {products[0].sample && '· SAMPLE CONCEPT'}
                </span>
                <h3>{products[0].title}</h3>
                <p>{products[0].description}</p>
                <FeatureList items={products[0].data.features} />
                <Link className="button button-outline" href={`/products/${products[0].slug}`}>
                  Discover the product
                </Link>
              </div>
              <div className="product-feature-image">
                <Image
                  src={products[0].data.cover}
                  alt={`${products[0].title} concept preview`}
                  width={900}
                  height={560}
                />
              </div>
            </div>
          ) : (
            <p>Products will be listed here when published.</p>
          )}
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="WHAT WE BUILD"
          title="Your vision. Our engineering."
          description="An experienced development partner, from the first sketch to a product that’s ready for the world."
          href="/services"
          label="All services"
        />
        <div className="grid-3">
          {services.slice(0, 3).map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </section>
      <section className="container section" style={{ paddingTop: 0 }}>
        <SectionHeading
          eyebrow="THE TOOLKIT"
          title="Good tools make a difference."
          description="A curated starting point for building, designing, and running modern software."
          href="/tools"
          label="Explore the toolkit"
        />
        <div className="grid-4">
          {tools.map((e) => (
            <EntryCard entry={e} key={e.id} />
          ))}
        </div>
        <p className="sample-note">
          Sample editorial listings. Affiliate links are disclosed when configured.{' '}
          <Link className="text-link" href="/affiliate-disclosure">
            Read the disclosure.
          </Link>
        </p>
      </section>
      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="THE PROCESS"
            title="Great products don’t happen by accident."
            description="A clear, collaborative path from an ambitious idea to a considered launch."
          />
          <div className="process-grid">
            {[
              ['Discovery', 'Understand the problem and the people behind it.'],
              ['Planning', 'Define the scope, priorities, and roadmap.'],
              ['Design', 'Make the experience clear and intuitive.'],
              ['Development', 'Build a reliable, maintainable product.'],
              ['Testing', 'Check the details and the complete journey.'],
              ['Launch', 'Ship with confidence and a plan for what’s next.'],
            ].map(([title, text], i) => (
              <div className="process-step" key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          eyebrow="NOTES & IDEAS"
          title="Thinking out loud. Building in public."
          href="/blog"
          label="Visit the journal"
        />
        <div className="grid-3">
          {posts.map((e) => (
            <EntryCard entry={e} key={e.id} />
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
