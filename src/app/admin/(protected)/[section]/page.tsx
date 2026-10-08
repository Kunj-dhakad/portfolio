import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { kinds, type Kind } from '@/types';
import { getEntries, getSettings } from '@/lib/content';
import { db } from '@/lib/db';
import { DeleteButton } from '@/components/admin/delete-button';
import { SettingsForm } from '@/components/admin/settings-form';
import { EnquiryManager } from '@/components/admin/enquiry-manager';
export default async function AdminSection({ params }: { params: Promise<{ section: string }> }) {
  await requireAdmin();
  const { section } = await params;
  if (section === 'settings')
    return (
      <>
        <h1>Website settings</h1>
        <p>Your brand, contact details, and search appearance.</p>
        <SettingsForm settings={await getSettings()} />
      </>
    );
  if (section === 'enquiries') {
    const rows = await db().enquiry.findMany({ orderBy: { createdAt: 'desc' } });
    return (
      <>
        <h1>Project enquiries</h1>
        <p>Private conversations. Review requirements and keep track of follow-ups.</p>
        <EnquiryManager
          enquiries={rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
        />
      </>
    );
  }
  if (!kinds.includes(section as Kind)) notFound();
  const entries = await getEntries(section as Kind, true);
  return (
    <>
      <div className="section-heading">
        <div>
          <h1 style={{ textTransform: 'capitalize' }}>{section}</h1>
          <p>Draft, publish, and maintain your {section}.</p>
        </div>
        <Link className="button button-primary" href={`/admin/${section}/new`}>
          Add new
        </Link>
      </div>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Publication</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id}>
                <td>
                  <strong>{e.title}</strong>
                  {e.sample && <p>Sample content</p>}
                </td>
                <td>{e.category}</td>
                <td>
                  {e.published ? 'Published' : 'Draft'}
                  {e.featured ? ' · Featured' : ''}
                </td>
                <td>{new Date(e.updatedAt).toLocaleDateString('en-US')}</td>
                <td>
                  <div className="table-actions">
                    <Link className="text-link" href={`/admin/${section}/${e.id}`}>
                      Edit
                    </Link>
                    <DeleteButton id={e.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!entries.length && (
          <div className="empty-state">
            <h2>No content yet.</h2>
            <p>Add your first entry to get started.</p>
          </div>
        )}
      </div>
    </>
  );
}
