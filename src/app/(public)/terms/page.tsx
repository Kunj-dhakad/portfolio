import { Breadcrumbs } from '@/components/shared';
export const metadata = { title: 'Terms of Use', alternates: { canonical: '/terms' } };
export default function Terms() {
  return (
    <div className="container legal">
      <div className="page-head">
        <Breadcrumbs title="Terms" />
        <span className="eyebrow">USING THIS WEBSITE</span>
        <h1>Terms of use</h1>
        <p>Last updated: October 8, 2026</p>
      </div>
      <article className="prose">
        <div className="notice">
          Terms template. Adapt to the operating business and its applicable requirements before
          launch.
        </div>
        <h2>Website content</h2>
        <p>
          This website presents software projects, services, editorial content, and tool listings.
          Sample content is labelled and is provided to demonstrate the website structure.
        </p>
        <h2>Project enquiries</h2>
        <p>
          Submitting an enquiry does not form a service agreement. Project scope, pricing, delivery,
          support, and ownership must be agreed separately in writing.
        </p>
        <h2>Third-party tools and links</h2>
        <p>
          External services have their own terms, pricing, and policies. Check official sources
          before making a purchase or using a service. Listings do not guarantee suitability for a
          particular purpose.
        </p>
        <h2>Acceptable use</h2>
        <p>
          Do not attempt unauthorized access, interfere with the service, or submit abusive or
          malicious content.
        </p>
        <h2>Intellectual property</h2>
        <p>
          Respect the rights of the site owner and third parties. Tool names and trademarks belong
          to their respective owners.
        </p>
        <h2>Availability and changes</h2>
        <p>
          Content and availability may change. Product descriptions and editorial content are
          informational; confirm current details with the relevant provider.
        </p>
        <h2>Contact</h2>
        <p>Questions about these terms can be submitted through the contact page.</p>
      </article>
    </div>
  );
}
