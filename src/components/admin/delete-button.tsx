'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export function DeleteButton({ id, resource = 'content' }: { id: string; resource?: string }) {
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function remove() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/${resource}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setError((await res.json()).error);
        return;
      }
      router.refresh();
    } catch {
      setError('Delete failed. Try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      {confirm ? (
        <div className="table-actions">
          <button className="danger-button" disabled={busy} onClick={remove}>
            {busy ? 'Deleting…' : 'Confirm delete'}
          </button>
          <button className="danger-button" onClick={() => setConfirm(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="danger-button" onClick={() => setConfirm(true)}>
          Delete
        </button>
      )}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
