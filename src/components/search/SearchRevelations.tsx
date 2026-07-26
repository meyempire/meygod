"use client";

import { useState, useEffect } from "react";

interface SearchRevelationsProps {
  onSearch: (query: string) => void;
}

export function SearchRevelations({ onSearch }: SearchRevelationsProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => onSearch(query), 150);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
        fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search revelations and dreams..."
        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-line/20 bg-surface text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all text-sm"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
