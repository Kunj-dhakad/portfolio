'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ContentData, Entry, Kind } from '@/types';
import { contentSchema } from '@/lib/validations';
const arrayKeys = [
  'screenshots',
  'technologies',
  'features',
  'benefits',
  'pros',
  'cons',
  'tags',
] as const;
const labels: Partial<Record<keyof ContentData, string>> = {
  body: 'Article / full description (Markdown)',
  cover: 'Cover image path',
  logo: 'Product / tool logo path (optional)',
  screenshots: 'Screenshot paths (one per line)',
  technologies: 'Technologies (one per line)',
  features: 'Features (one per line)',
  challenges: 'Challenges',
  solutions: 'Solutions',
  projectType: 'Project type',
  status: 'Status',
  liveUrl: 'Live URL',
  demoUrl: 'Demo URL',
  githubUrl: 'GitHub URL',
  productUrl: 'Product URL',
  audience: 'Target audience',
  benefits: 'Benefits (one per line)',
  pricing: 'Pricing description',
  affiliateUrl: 'Affiliate URL',
  officialUrl: 'Official website URL',
  pros: 'Pros (one per line)',
  cons: 'Cons (one per line)',
  tags: 'Tags (one per line)',
  author: 'Author',
  publishedAt: 'Publication date',
  seoTitle: 'SEO title',
  seoDescription: 'SEO description',
};
export function ContentEditor({
  kind,
  entry,
  blankData,
}: {
  kind: Kind;
  entry?: Entry;
  blankData: ContentData;
}) {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const d = entry?.data || blankData;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const form = new FormData(event.currentTarget);
    const data: Record<string, unknown> = { ...blankData, ...d };
    for (const key of Object.keys(blankData)) {
      if (key === 'disclosure') data[key] = form.has(key);
      else if (!form.has(key)) continue;
      else if (arrayKeys.includes(key as (typeof arrayKeys)[number]))
        data[key] = String(form.get(key) || '')
          .split('\n')
          .map((v) => v.trim())
          .filter(Boolean);
      else data[key] = String(form.get(key) || '');
    }
    const input = {
      kind,
      title: String(form.get('title')),
      slug: String(form.get('slug')),
      description: String(form.get('description')),
      category: String(form.get('category')),
      published: form.has('published'),
      featured: form.has('featured'),
      sample: form.has('sample'),
      data,
    };
    const parsed = contentSchema.safeParse(input);
    if (!parsed.success) {
      setMessage(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '));
      setBusy(false);
      return;
    }
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry?.id, entry: parsed.data }),
      });
      const body = await res.json();
      if (!res.ok) setMessage(body.error);
      else {
        router.push(`/admin/${kind}`);
        router.refresh();
      }
    } catch {
      setMessage('Unable to save. Try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-card admin-editor" onSubmit={submit}>
      <div className="form-grid">
        {[
          ['title', 'Title'],
          ['slug', 'URL slug'],
          ['category', 'Category'],
          ['description', 'Short description'],
        ].map(([key, label]) => (
          <div className={`field ${key === 'description' ? 'full' : ''}`} key={key}>
            <label htmlFor={key}>{label}</label>
            {key === 'description' ? (
              <textarea id={key} name={key} required defaultValue={entry?.description} />
            ) : (
              <input
                id={key}
                name={key}
                required
                defaultValue={entry?.[key as 'title' | 'slug' | 'category']}
                placeholder={key === 'slug' ? 'lowercase-hyphenated-slug' : ''}
              />
            )}
          </div>
        ))}
      </div>
      <div className="check-row">
        <label>
          <input type="checkbox" name="published" defaultChecked={entry?.published} />
          Published
        </label>
        <label>
          <input type="checkbox" name="featured" defaultChecked={entry?.featured} />
          Featured
        </label>
        <label>
          <input type="checkbox" name="sample" defaultChecked={entry?.sample ?? true} />
          Sample content
        </label>
        <label>
          <input type="checkbox" name="disclosure" defaultChecked={d.disclosure} />
          Show affiliate disclosure
        </label>
      </div>
      <h2>Content and presentation</h2>
      <p className="sample-note" style={{ marginBottom: 20 }}>
        Image paths refer to files in public/. Use Markdown for formatted content; raw HTML is not
        rendered. Empty URLs hide their buttons.
      </p>
      <div className="form-grid">
        {Object.entries(labels)
          .filter(([key]) => {
            const common = ['body', 'cover', 'seoTitle', 'seoDescription'];
            const specific: Record<Kind, string[]> = {
              projects: [
                'screenshots',
                'technologies',
                'features',
                'challenges',
                'solutions',
                'projectType',
                'status',
                'liveUrl',
                'demoUrl',
                'githubUrl',
              ],
              products: [
                'logo',
                'screenshots',
                'features',
                'status',
                'productUrl',
                'demoUrl',
                'audience',
                'benefits',
                'pricing',
              ],
              tools: [
                'logo',
                'features',
                'status',
                'affiliateUrl',
                'officialUrl',
                'pros',
                'cons',
                'pricing',
              ],
              blog: ['tags', 'author', 'publishedAt'],
            };
            return common.includes(key) || specific[kind].includes(key);
          })
          .map(([key, label]) => {
            const value = d[key as keyof ContentData];
            const isArray = Array.isArray(value);
            const multiline =
              isArray ||
              ['body', 'challenges', 'solutions', 'pricing', 'seoDescription'].includes(key);
            return (
              <div className={`field ${key === 'body' ? 'full' : ''}`} key={key}>
                <label htmlFor={key}>{label}</label>
                {multiline ? (
                  <textarea
                    id={key}
                    name={key}
                    defaultValue={isArray ? value.join('\n') : String(value)}
                    style={key === 'body' ? { minHeight: 320 } : undefined}
                  />
                ) : (
                  <input
                    id={key}
                    name={key}
                    type={key === 'publishedAt' ? 'date' : key.endsWith('Url') ? 'url' : 'text'}
                    defaultValue={String(value)}
                  />
                )}
              </div>
            );
          })}
      </div>
      <div className="button-row" style={{ marginTop: 30 }}>
        <button disabled={busy} className="button button-primary">
          {busy ? 'Saving…' : 'Save content'}
        </button>
        <Link className="button button-outline" href={`/admin/${kind}`}>
          Cancel
        </Link>
      </div>
      {message && (
        <p className="form-status error" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
