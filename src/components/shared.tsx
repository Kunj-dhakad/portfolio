import Link from 'next/link';
import Image from 'next/image';
import {
  ExternalLink,
  ArrowUpRight,
  Check,
  Layers,
  Code2,
  Sparkles,
  Network,
  Rocket,
  LayoutDashboard,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeUrl } from '@/lib/utils';
import type { Entry } from '@/types';
import { services } from '@/data/content';
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  label,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          <span /> {eyebrow}
        </span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {label || 'Explore all'} <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function EntryCard({ entry }: { entry: Entry }) {
  const tool = entry.kind === 'tools';
  return (
    <article className={`entry-card ${tool ? 'tool-card' : ''}`}>
      {tool ? (
        <div className={`tool-logo logo-${entry.slug}`}>
          {entry.data.logo ? (
            <Image src={entry.data.logo} width={36} height={36} alt={`${entry.title} logo`} />
          ) : (
            entry.title.slice(0, 1)
          )}
        </div>
      ) : (
        <Link
          href={`/${entry.kind}/${entry.slug}`}
          className={`card-cover cover-${entry.id.slice(-1)}`}
        >
          <Image
            src={entry.data.cover || '/previews/workspace.svg'}
            alt={`${entry.title} illustrative preview`}
            width={900}
            height={560}
          />
          <span className="preview-label">
            {entry.sample ? 'CONCEPT PREVIEW' : entry.data.status}
          </span>
        </Link>
      )}
      <div className="card-body">
        <div className="card-meta">
          <span>{entry.category}</span>
          {entry.sample && <span className="sample-badge">Sample</span>}
        </div>
        <Link href={`/${entry.kind}/${entry.slug}`} className="card-title">
          {entry.title}
          <ArrowUpRight size={20} />
        </Link>
        <p>{entry.description}</p>
        {entry.data.technologies.length > 0 && (
          <div className="tags">
            {entry.data.technologies.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
        <div className="card-bottom">
          <Link href={`/${entry.kind}/${entry.slug}`} className="text-link">
            {tool ? 'Explore tool' : entry.kind === 'blog' ? 'Read article' : 'View details'}
          </Link>
          {!tool && entry.kind !== 'blog' && (
            <span className="status-label">{entry.data.status}</span>
          )}
          {safeUrl(entry.data.demoUrl) && (
            <ExternalCTA url={entry.data.demoUrl} label="Live demo" />
          )}
        </div>
      </div>
    </article>
  );
}
export function ExternalCTA({
  url,
  label,
  sponsored = false,
}: {
  url: string;
  label: string;
  sponsored?: boolean;
}) {
  if (!safeUrl(url)) return null;
  return (
    <a
      className="button button-outline button-sm"
      href={url}
      target="_blank"
      rel={sponsored ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
    >
      {label}
      <ExternalLink size={15} />
    </a>
  );
}
const icons = { Layers, Code: Code2, Sparkles, Network, Rocket, LayoutDashboard, RefreshCw };
export function ServiceCard({ service }: { service: (typeof services)[number] }) {
  const Icon = icons[service.icon as keyof typeof icons];
  return (
    <article className="service-card">
      <span className="service-icon">
        <Icon size={23} />
      </span>
      <h3>{service.title}</h3>
      <p>{service.text}</p>
      <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="text-link">
        Discuss your project <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
export function CTA() {
  return (
    <section className="container cta-banner">
      <span className="eyebrow">YOUR NEXT CHAPTER</span>
      <h2>
        Have an idea?
        <br />
        Let’s make it <em>real.</em>
      </h2>
      <p>
        From the first conversation to the final launch,
        <br className="desktop-break" /> let’s build something that matters.
      </p>
      <div className="button-row">
        <Button asChild>
          <Link href="/contact">Discuss your project</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">Explore our work</Link>
        </Button>
      </div>
      <div className="cta-orbit" aria-hidden="true" />
    </section>
  );
}
export function Breadcrumbs({ title, section }: { title: string; section?: string }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      <span>/</span>
      {section && (
        <>
          <Link href={`/${section}`}>{section.replace('-', ' ')}</Link>
          <span>/</span>
        </>
      )}
      <span aria-current="page">{title}</span>
    </nav>
  );
}
export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="feature-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={17} />
          {item}
        </li>
      ))}
    </ul>
  );
}
