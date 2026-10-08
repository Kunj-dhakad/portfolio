import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { AdminNav } from '@/components/admin/nav';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin Dashboard', robots: { index: false, follow: false } };
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdmin())) redirect('/admin/login');
  return (
    <div className="admin-shell">
      <AdminNav />
      <main id="main-content" className="admin-main">
        {children}
      </main>
    </div>
  );
}
