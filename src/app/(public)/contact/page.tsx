import { ContactForm } from '@/components/contact-form';
import { Breadcrumbs } from '@/components/shared';
import { getSettings } from '@/lib/content';
export const metadata = {
  title: 'Contact',
  description: 'Discuss your SaaS idea or custom software project.',
  alternates: { canonical: '/contact' },
};
export default async function Contact() {
  const settings = await getSettings();
  return (
    <>
      <div className="container page-head">
        <Breadcrumbs title="Contact" />
        <span className="eyebrow">LET’S BUILD SOMETHING</span>
        <h1>
          Your next great idea
          <br />
          starts with a conversation.
        </h1>
        <p>
          Tell me what you have in mind. Let’s explore the problem, the possibilities, and the right
          path forward.
        </p>
      </div>
      <div className="container contact-layout">
        <div className="contact-info">
          <h2>
            A thoughtful partner
            <br />
            for your next chapter.
          </h2>
          <p>
            Whether you’re starting from a rough idea or improving an existing product, share a few
            details and we can work out the next step together.
          </p>
          {settings.email && (
            <p>
              <a className="text-link" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
          )}
          <div className="service-card">
            <span className="eyebrow">WHAT HAPPENS NEXT</span>
            <h3>A clear place to start.</h3>
            <p>
              I’ll review your requirements, ask any useful follow-up questions, and discuss scope,
              timing, and fit before any commitment.
            </p>
            <span className="muted" style={{ fontSize: 13 }}>
              Based in India · Working across time zones
            </span>
          </div>
        </div>
        <ContactForm />
      </div>
    </>
  );
}
