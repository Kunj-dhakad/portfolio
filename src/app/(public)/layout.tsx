import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getSettings } from '@/lib/content';
export const dynamic = 'force-dynamic';
export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: { default: settings.seoTitle, template: `%s · ${settings.brand}` },
    description: settings.seoDescription,
    openGraph: {
      type: 'website',
      siteName: settings.brand,
      title: settings.seoTitle,
      description: settings.seoDescription,
      images: ['/opengraph-image'],
    },
  };
}
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Navbar settings={settings} />
      <main id="main-content">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
