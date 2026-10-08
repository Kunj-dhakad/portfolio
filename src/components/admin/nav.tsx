'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Wrench,
  FileText,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
const links = [
  ['Overview', '/admin', LayoutDashboard],
  ['Projects', '/admin/projects', FolderKanban],
  ['Products', '/admin/products', Layers],
  ['Affiliate tools', '/admin/tools', Wrench],
  ['Blog', '/admin/blog', FileText],
  ['Enquiries', '/admin/enquiries', Inbox],
  ['Settings', '/admin/settings', Settings],
] as const;
export function AdminNav() {
  const path = usePathname();
  const router = useRouter();
  const [error, setError] = useState('');
  async function logout() {
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      router.replace('/admin/login');
      router.refresh();
    } catch {
      setError('Unable to sign out. Try again.');
    }
  }
  return (
    <aside className="admin-sidebar">
      <h2>Navonixx. / Studio</h2>
      <nav aria-label="Admin navigation">
        {links.map(([label, url, Icon]) => (
          <Link
            key={url}
            href={url}
            className={path === url || (url !== '/admin' && path.startsWith(url)) ? 'active' : ''}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
        <Link href="/">
          <ExternalLink size={17} />
          View website
        </Link>
      </nav>
      <button
        className="button button-ghost"
        onClick={logout}
        style={{ paddingLeft: 12, marginTop: 20 }}
      >
        <LogOut size={16} />
        Sign out
      </button>
      {error && <p role="alert">{error}</p>}
    </aside>
  );
}
