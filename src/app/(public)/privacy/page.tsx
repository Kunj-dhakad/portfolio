import { Breadcrumbs } from '@/components/shared';
export const metadata = { title: 'Privacy Policy', alternates: { canonical: '/privacy' } };
export default function Privacy() {
  return (
    <div className="container legal">
      <div className="page-head">
        <Breadcrumbs title="Privacy" />
        <span className="eyebrow">YOUR INFORMATION</span>
        <h1>Privacy policy</h1>
        <p>Last updated: October 8, 2026</p>
      </div>
      <article className="prose">
        <div className="notice">
          Policy template. The site owner must adapt this to their business, hosting providers,
          retention practices, and applicable requirements before launch.
        </div>
        <h2>Information you share</h2>
        <p>
          The enquiry form collects your name, email, optional company and website, and project
          requirements. These details are used to assess and respond to your enquiry and are stored
          privately.
        </p>
        <h2>How information is used</h2>
        <p>
          Enquiry information is used for project discussions and related communications. If email
          notifications are configured, enquiry details are sent to the site owner through the
          configured email provider.
        </p>
        <h2>Cookies and preferences</h2>
        <p>
          Administrator authentication uses a secure session cookie. Theme preferences are stored in
          your browser. Public visitors do not need an account.
        </p>
        <h2>Technical and analytics data</h2>
        <p>
          Hosting providers may process technical request information. Public form submissions use
          hashed request identifiers for rate limiting. Optional analytics should only be enabled
          after this policy and any necessary consent mechanism reflect the configured provider.
        </p>
        <h2>Retention and your choices</h2>
        <p>
          The site owner can delete enquiries from the admin dashboard. Contact the owner through
          the contact page to request access, correction, or deletion of information you submitted.
          The final retention period must be defined before launch.
        </p>
        <h2>External websites</h2>
        <p>
          Links to tools and demos lead to external websites, which have their own privacy
          practices.
        </p>
        <h2>Contact</h2>
        <p>Use the contact page for questions about how your information is handled.</p>
      </article>
    </div>
  );
}
