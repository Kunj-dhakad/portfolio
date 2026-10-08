'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function LoginForm() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      const body = await res.json();
      if (!res.ok) setError(body.error);
      else {
        router.replace('/admin');
        router.refresh();
      }
    } catch {
      setError('Unable to connect. Try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit}>
      <div className="field">
        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="field">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
        />
      </div>
      <button className="button button-primary" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in to dashboard'}
      </button>
      {error && (
        <p role="alert" className="form-status error">
          {error}
        </p>
      )}
    </form>
  );
}
