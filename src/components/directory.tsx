'use client';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { EntryCard } from '@/components/shared';
import type { Entry } from '@/types';
export function Directory({ entries }: { entries: Entry[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [sort, setSort] = useState('Newest');
  const categories = [...new Set(entries.map((e) => e.category))];
  const filtered = useMemo(
    () =>
      entries
        .filter(
          (e) =>
            (category === 'All categories' || e.category === category) &&
            `${e.title} ${e.description} ${e.data.technologies.join(' ')}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sort === 'A–Z'
            ? a.title.localeCompare(b.title)
            : sort === 'Featured'
              ? Number(b.featured) - Number(a.featured)
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [entries, category, search, sort],
  );
  return (
    <>
      <div className="filter-bar">
        <div className="search-input">
          <Search />
          <input
            aria-label="Search entries"
            placeholder="Search by name, topic, or technology…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select aria-label="Sort entries" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option>Newest</option>
          <option>Featured</option>
          <option>A–Z</option>
        </select>
      </div>
      <p className="results-label" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
      </p>
      {filtered.length ? (
        <div className="grid-3">
          {filtered.map((e) => (
            <EntryCard entry={e} key={e.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No results yet.</h2>
          <p>Try another search or category.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setSearch('');
              setCategory('All categories');
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </>
  );
}
