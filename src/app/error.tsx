'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="container error-layout">
      <h1>A brief interruption.</h1>
      <p>This page is temporarily unavailable. Please try again.</p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
