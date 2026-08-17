"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function Pagination({
  totalPages,
  basePath,
}: {
  totalPages: number;
  basePath: string;
}) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="flex justify-center items-center gap-2" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={createUrl(currentPage - 1)}
          className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface border border-line/20 transition-all"
        >
          Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={createUrl(p)}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all border ${
            p === currentPage
              ? "text-text bg-accent/15 border-accent/30 font-bold"
              : "text-text-muted hover:text-text hover:bg-surface border-line/20"
          }`}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={createUrl(currentPage + 1)}
          className="px-3 py-1.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface border border-line/20 transition-all"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
