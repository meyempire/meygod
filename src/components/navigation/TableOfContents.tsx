"use client";

import { useEffect, useState } from "react";
import { TocEntry } from "@/lib/toc";

interface TableOfContentsProps {
  headings: TocEntry[];
  className?: string;
}

export function TableOfContents({ headings, className = "" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    const elements = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className={`sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto ${className}`} aria-label="Table of contents">
      <h4 className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">On this page</h4>
      <ul className="space-y-1.5 border-l border-line/20">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: heading.depth === 3 ? "1rem" : "0" }}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                history.pushState(null, "", `#${heading.id}`);
              }}
              className={`block text-sm py-1 pl-4 border-l-2 -ml-px transition-all duration-150 ${
                activeId === heading.id
                  ? "border-accent text-accent-2 font-medium"
                  : "border-transparent text-text-muted hover:text-text hover:border-line"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
