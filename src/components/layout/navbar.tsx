'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Code2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { SiteSettings } from '@/types';
const links = [
  ['Home', '/'],
  ['Projects', '/projects'],
  ['Products', '/products'],
  ['Tools', '/tools'],
  ['Services', '/services'],
  ['Blog', '/blog'],
  ['About', '/about'],
];
export function Navbar({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => setMounted(true), []);
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label={`${settings.brand} home`}>
          {settings.logo ? (
            <Image
              className="brand-image"
              src={settings.logo}
              width={48}
              height={48}
              alt=""
              priority
            />
          ) : (
            <span className="brand-mark">
              <Code2 size={22} />
            </span>
          )}
          <span className="brand-wordmark">
            {settings.brand}
            <small>DIGITAL PRODUCT STUDIO</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, url]) => {
            const active = pathname === url || (url !== '/' && pathname.startsWith(url));
            return (
              <Link
                className={active ? 'active' : ''}
                aria-current={active ? 'page' : undefined}
                key={url}
                href={url}
              >
                {active && (
                  <motion.span
                    className="nav-active-pill"
                    layoutId="navigation-pill"
                    transition={
                      reduced ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 36 }
                    }
                    aria-hidden="true"
                  />
                )}
                <span className="nav-link-label">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-button"
            aria-label="Toggle color theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link href="/contact" className="button button-primary button-sm nav-contact">
            Let’s talk <span className="tiny-dot" />
          </Link>
          <button
            className="icon-button mobile-toggle"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {[...links, ['Contact', '/contact']].map(([label, url]) => (
            <Link key={url} href={url} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
