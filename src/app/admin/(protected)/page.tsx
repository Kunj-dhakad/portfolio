import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { getEntries } from '@/lib/content';
export default async function Admin() {
  await requireAdmin();
  const [entries, enquiries] = await Promise.all([
    getEntries(undefined, true),
    db().enquiry.count(),
  ]);
  return (
    <>
      <span className="eyebrow">YOUR WEBSITE, AT A GLANCE</span>
      <h1>Studio overview</h1>
      <p>Manage your work, publish ideas, and follow up on project enquiries.</p>
      <div className="admin-stats">
        {[
          ['Projects', entries.filter((e) => e.kind === 'projects').length],
          ['Products', entries.filter((e) => e.kind === 'products').length],
          ['Published articles', entries.filter((e) => e.kind === 'blog' && e.published).length],
          ['Enquiries', enquiries],
        ].map(([label, count]) => (
          <div className="admin-stat" key={label}>
            <span>{label}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
      {entries.some((e) => e.sample) && (
        <div className="notice">
          Sample content is active. Edit or remove samples before presenting your professional work.
        </div>
      )}
      <h2 style={{ fontSize: 23, marginBottom: 20 }}>Start with your content</h2>
      <div className="grid-3">
        {[
          ['Projects', 'Show the work behind your brand.', 'projects'],
          ['Journal', 'Publish a draft or a new idea.', 'blog'],
          ['Settings', 'Make the site your own.', 'settings'],
        ].map(([title, text, path]) => (
          <div className="service-card" key={path}>
            <h3>{title}</h3>
            <p style={{ marginTop: 15 }}>{text}</p>
            <Link className="text-link" href={`/admin/${path}`}>
              Manage {title.toLowerCase()}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
