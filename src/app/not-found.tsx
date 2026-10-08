import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main-content" className="container error-layout">
      <span className="eyebrow">404 · A DETOUR</span>
      <h1>This page isn’t here.</h1>
      <p>The link may have changed, or the content may no longer be published.</p>
      <Link href="/" className="button button-primary">
        Back to home
      </Link>
    </main>
  );
}
