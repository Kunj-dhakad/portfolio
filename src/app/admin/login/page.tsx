import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/auth';
import { LoginForm } from '@/components/admin/login-form';
export const metadata = { title: 'Admin Login', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export default async function Login() {
  if (await getAdmin()) redirect('/admin');
  return (
    <main id="main-content" className="login-wrap">
      <Link href="/" className="brand" style={{ marginBottom: 30 }}>
        Navonixx.
      </Link>
      <div className="form-card">
        <span className="eyebrow">PRIVATE WORKSPACE</span>
        <h1>Welcome back.</h1>
        <p>Sign in to manage your website.</p>
        {(!process.env.DATABASE_URL || !process.env.AUTH_SECRET) && (
          <div className="notice">
            Admin access requires a database, an authentication secret, and an admin account. See
            the setup instructions in README.md.
          </div>
        )}
        <LoginForm />
      </div>
    </main>
  );
}
