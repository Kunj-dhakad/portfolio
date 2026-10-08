import { Breadcrumbs } from '@/components/shared';
import { getSettings } from '@/lib/content';
export const metadata = {
  title: 'Affiliate Disclosure',
  alternates: { canonical: '/affiliate-disclosure' },
};
export default async function Disclosure() {
  const settings = await getSettings();
  return (
    <div className="container legal">
      <div className="page-head">
        <Breadcrumbs title="Affiliate disclosure" />
        <span className="eyebrow">TRANSPARENT RECOMMENDATIONS</span>
        <h1>Affiliate disclosure</h1>
      </div>
      <article className="prose">
        <p>{settings.disclosure}</p>
        <h2>How links work</h2>
        <p>
          When an affiliate URL is configured, its outbound link is identified as sponsored. Other
          links point to official websites. No commercial partnership or affiliate URL is assumed
          for sample listings.
        </p>
        <h2>Editorial independence</h2>
        <p>
          Tool listings should explain relevant features and limitations. Sample entries are not
          first-hand reviews. Always verify current pricing, features, and suitability on the
          provider’s official website.
        </p>
        <h2>Your decision</h2>
        <p>
          Compare software against your own requirements before buying. Contact the site owner if
          you have a question about a particular recommendation.
        </p>
      </article>
    </div>
  );
}
