import { Breadcrumbs, ServiceCard, CTA, FeatureList, SectionHeading } from '@/components/shared';
import { services } from '@/data/content';
import Link from 'next/link';
export const metadata = {
  title: 'Development Services',
  description: 'SaaS, MVP, web application, AI integration, and modernization services.',
  alternates: { canonical: '/services' },
};
export default function Services() {
  return (
    <>
      <div className="container page-head">
        <Breadcrumbs title="Services" />
        <span className="eyebrow">FROM POSSIBILITY TO PRODUCT</span>
        <h1>
          Software built around
          <br />
          your business.
        </h1>
        <p>
          Clear thinking, considered design, and dependable engineering. A collaborative development
          partner for the work that matters.
        </p>
      </div>
      <section className="container directory">
        <div className="grid-3">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </section>
      <section className="section section-tinted">
        <div className="container">
          <SectionHeading
            eyebrow="WHAT YOU CAN EXPECT"
            title="A clear scope. A considered delivery."
          />
          <div className="grid-2">
            {services.map((s) => (
              <div className="service-card" key={s.title}>
                <h3>{s.title}</h3>
                <p style={{ marginTop: 15 }}>{s.text}</p>
                <h4>Typical deliverables</h4>
                <FeatureList items={s.deliverables} />
                <p>
                  Built with a suitable mix of Next.js, TypeScript, PostgreSQL, APIs, and proven
                  integration tools.
                </p>
                <Link
                  className="text-link"
                  href={`/contact?service=${encodeURIComponent(s.title)}`}
                >
                  Discuss your requirements
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container section">
        <SectionHeading eyebrow="COMMON QUESTIONS" title="Before we get started." />
        <div className="faq">
          {[
            [
              'How does a project begin?',
              'We start with discovery: your users, business goals, existing systems, and constraints. Then we agree on scope, deliverables, and a realistic roadmap.',
            ],
            [
              'Can you work with an existing application?',
              'Yes. Modernization begins with a technical assessment and an incremental plan, so useful improvements can be delivered without unnecessary disruption.',
            ],
            [
              'How are budgets and timelines agreed?',
              'Both depend on the scope and integrations. Share your requirements and preferred timeline in the enquiry form so we can discuss a tailored proposal.',
            ],
            [
              'What happens after launch?',
              'Handover includes agreed documentation and launch support. Ongoing maintenance and future improvements can be scoped separately.',
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
