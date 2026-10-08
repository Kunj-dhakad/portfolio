import { Breadcrumbs, CTA, FeatureList } from '@/components/shared';
import Image from 'next/image';
export const metadata = {
  title: 'About',
  description: 'Meet the builder behind the software.',
  alternates: { canonical: '/about' },
};
export default function About() {
  return (
    <>
      <div className="container page-head">
        <Breadcrumbs title="About" />
        <span className="eyebrow">THE STUDIO BEHIND THE PRODUCTS</span>
        <h1>
          Curiosity drives the idea.
          <br />
          Craft brings it to life.
        </h1>
      </div>
      <section className="container about-grid">
        <div className="prose">
          <h2>We are Navonixx.</h2>
          <p>
            Navonixx is a digital product studio based in India, focused on SaaS applications,
            useful web experiences, and the systems that make them work.
          </p>
          <p>
            Our approach connects design with engineering: understand the problem, simplify the
            workflow, and make deliberate decisions about what to build.
          </p>
          <div className="notice">
            This biography is a starting point. Add your professional background, authentic
            experience, and personal story before publishing.
          </div>
          <h2>What we care about</h2>
          <FeatureList
            items={[
              'Products that solve a clear problem',
              'Simple, accessible user experiences',
              'Maintainable systems and dependable delivery',
              'Open communication and thoughtful collaboration',
            ]}
          />
          <h2>Tools of the craft</h2>
          <p>
            Next.js, React, TypeScript, PostgreSQL, Prisma, API integrations, and AI-powered
            workflows.
          </p>
        </div>
        <div className="about-monogram" aria-label="Navonixx brand monogram">
          <Image
            src="/brand/navonixx-logo.png"
            alt="Navonixx studio logo"
            width={300}
            height={300}
          />
          <span>IDEAS · ENGINEERING · INTENTION</span>
        </div>
      </section>
      <CTA />
    </>
  );
}
