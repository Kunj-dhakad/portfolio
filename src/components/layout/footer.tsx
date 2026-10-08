import Link from 'next/link';
import Image from 'next/image';
import { Code2, Github, Linkedin, ArrowUpRight, Globe2 } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { safeUrl } from '@/lib/utils';
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="footer">
      <div className="container footer-invitation">
        <div>
          <span className="eyebrow">THE NEXT GREAT THING STARTS HERE</span>
          <h2>
            Good ideas deserve
            <br />
            <span>exceptional execution.</span>
          </h2>
        </div>
        <Link className="footer-project-link" href="/contact">
          <span>
            Let’s build
            <br />
            something great
          </span>
          <span className="footer-project-icon">
            <ArrowUpRight size={28} />
          </span>
        </Link>
      </div>
      <div className="container footer-top">
        <div>
          <Link className="brand" href="/">
            {settings.logo ? (
              <Image className="brand-image" src={settings.logo} alt="" width={48} height={48} />
            ) : (
              <span className="brand-mark">
                <Code2 size={22} />
              </span>
            )}
            <span className="brand-wordmark">
              {settings.brand}
              <small>ENGINEERED WITH INTENTION</small>
            </span>
          </Link>
          <p>
            Thoughtful software.
            <br />
            Meaningful digital experiences.
          </p>
          <div className="socials">
            {safeUrl(settings.github) && (
              <a
                href={settings.github}
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} />
              </a>
            )}
            {safeUrl(settings.linkedin) && (
              <a
                href={settings.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
            )}
          </div>
        </div>
        <div>
          <h3>Explore</h3>
          {[
            ['Projects', '/projects'],
            ['SaaS products', '/products'],
            ['Recommended tools', '/tools'],
            ['Case studies', '/case-studies'],
          ].map(([label, url]) => (
            <Link key={url} href={url}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h3>Let’s connect</h3>
          {[
            ['Services', '/services'],
            ['About Navonixx', '/about'],
            ['Journal', '/blog'],
            ['Discuss a project', '/contact'],
          ].map(([label, url]) => (
            <Link key={url} href={url}>
              {label}
            </Link>
          ))}
        </div>
        <div className="footer-note">
          <span className="footer-globe">
            <Globe2 size={24} />
          </span>
          <span className="eyebrow">LOCAL ROOTS. GLOBAL IDEAS.</span>
          <p>
            Based in India.
            <br />
            Building for a global audience.
          </p>
          <Link className="text-link" href="/contact">
            Start a conversation
          </Link>
        </div>
      </div>
      <div className="container footer-wordmark" aria-hidden="true">
        {settings.brand}
        <span>✦</span>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {settings.brand} All rights reserved.
        </span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
        </div>
      </div>
    </footer>
  );
}
