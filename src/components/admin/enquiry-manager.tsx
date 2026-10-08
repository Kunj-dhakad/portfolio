'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteButton } from './delete-button';
type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  budget: string;
  description: string;
  timeline: string;
  website: string | null;
  status: string;
  createdAt: string;
};
export function EnquiryManager({ enquiries }: { enquiries: Enquiry[] }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [busy, setBusy] = useState('');
  async function update(id: string, status: string) {
    setBusy(id);
    setError('');
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) setError((await res.json()).error);
      else router.refresh();
    } catch {
      setError('Unable to update enquiry.');
    } finally {
      setBusy('');
    }
  }
  const visible = enquiries.filter((e) => filter === 'All' || e.status === filter);
  return (
    <>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        aria-label="Filter enquiries by status"
        style={{ maxWidth: 220, marginTop: 20 }}
      >
        {['All', 'New', 'Reviewed', 'Contacted', 'Archived'].map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      {error && (
        <p role="alert" className="form-status error">
          {error}
        </p>
      )}
      {visible.map((e) => (
        <article className="admin-enquiry" key={e.id}>
          <h3>{e.name}</h3>
          <a className="text-link" href={`mailto:${e.email}`}>
            {e.email}
          </a>
          <dl>
            <div>
              <dt>Company</dt>
              <dd>{e.company || '—'}</dd>
            </div>
            <div>
              <dt>Project type</dt>
              <dd>{e.projectType}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>{e.budget}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{e.timeline}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>{e.website || '—'}</dd>
            </div>
            <div>
              <dt>Received</dt>
              <dd>{new Date(e.createdAt).toLocaleString('en-US')}</dd>
            </div>
          </dl>
          <p className="enquiry-text">{e.description}</p>
          <div className="enquiry-actions">
            <label htmlFor={`status-${e.id}`} className="muted">
              Status
            </label>
            <select
              id={`status-${e.id}`}
              value={e.status}
              disabled={busy === e.id}
              onChange={(event) => update(e.id, event.target.value)}
            >
              {['New', 'Reviewed', 'Contacted', 'Archived'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <DeleteButton id={e.id} resource="enquiries" />
          </div>
        </article>
      ))}
      {!visible.length && (
        <div className="empty-state" style={{ marginTop: 25 }}>
          <h2>No enquiries here.</h2>
          <p>New project submissions will appear in this private workspace.</p>
        </div>
      )}
    </>
  );
}
