'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteSettings } from '@/types';
const fields: Record<keyof SiteSettings, string> = {
  brand: 'Brand name',
  logo: 'Logo path (optional)',
  headline: 'Hero headline (line breaks supported)',
  description: 'Hero description',
  email: 'Contact email',
  github: 'GitHub URL',
  linkedin: 'LinkedIn URL',
  seoTitle: 'Default SEO title',
  seoDescription: 'Default SEO description',
  disclosure: 'Affiliate disclosure text',
};
export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      setStatus({ ok: res.ok, text: res.ok ? 'Settings saved.' : body.error });
      if (res.ok) router.refresh();
    } catch {
      setStatus({ ok: false, text: 'Unable to save settings.' });
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form-card admin-editor" onSubmit={submit}>
      <div className="form-grid">
        {Object.entries(fields).map(([key, label]) => (
          <div
            className={`field ${['headline', 'description', 'disclosure'].includes(key) ? 'full' : ''}`}
            key={key}
          >
            <label htmlFor={key}>{label}</label>
            {['headline', 'description', 'disclosure', 'seoDescription'].includes(key) ? (
              <textarea id={key} name={key} defaultValue={settings[key as keyof SiteSettings]} />
            ) : (
              <input
                id={key}
                name={key}
                type={key === 'email' ? 'email' : 'text'}
                defaultValue={settings[key as keyof SiteSettings]}
              />
            )}
          </div>
        ))}
      </div>
      <button className="button button-primary" style={{ marginTop: 25 }} disabled={busy}>
        {busy ? 'Saving…' : 'Save settings'}
      </button>
      {status && (
        <p role="status" className={`form-status ${status.ok ? 'success' : 'error'}`}>
          {status.text}
        </p>
      )}
    </form>
  );
}
