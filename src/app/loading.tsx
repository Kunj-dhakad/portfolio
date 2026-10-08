export default function Loading() {
  return (
    <div className="container loading-layout" role="status" aria-label="Loading page">
      <div className="skeleton" style={{ minHeight: 100, marginBottom: 30 }} />
      <div className="grid-3">
        {[0, 1, 2].map((i) => (
          <div className="skeleton" key={i} />
        ))}
      </div>
    </div>
  );
}
