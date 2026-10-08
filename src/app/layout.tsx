import type { Metadata } from 'next';
import Script from 'next/script';
import { Providers } from '@/components/layout/providers';
import { siteUrl } from '@/lib/utils';
import './globals.css';
import './soft-ui.css';
import './chrome.css';
import './page-composition.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: 'Navonixx — Digital Product Studio', template: '%s · Navonixx' },
  description: 'Thoughtful SaaS products, custom web applications, and digital experiences.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Navonixx Studio',
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/brand/navonixx-logo.png', apple: '/brand/navonixx-logo.png' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analytics = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT;
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Providers>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          {children}
        </Providers>
        {analytics?.startsWith('https://') && (
          <Script src={analytics} strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
