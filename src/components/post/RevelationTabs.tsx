"use client";

import { useState } from "react";
import { MDXContent } from "@/lib/mdx-runtime";
import VerseScripture from "./VerseScripture";
import { RawScripture } from "./RawScripture";

type Tab = "published" | "liturgical" | "unedited" | "scripture";

interface RevelationTabsProps {
  publishedCode: string;
  rawContent: string;
  bookTitle: string;
  scriptureFilename: string;
  letterImages?: string[];
}

export function RevelationTabs({
  publishedCode,
  rawContent,
  bookTitle,
  scriptureFilename,
  letterImages = [],
}: RevelationTabsProps) {
  const [tab, setTab] = useState<Tab>("published");

  const tabs: { key: Tab; label: string }[] = [
    { key: "published", label: "Published Word" },
    { key: "liturgical", label: "Liturgical" },
    ...(scriptureFilename ? [{ key: "unedited" as const, label: "The Unedited Word" }] : []),
    ...(letterImages.length > 0 ? [{ key: "scripture" as const, label: "Scripture" }] : []),
  ];

  return (
    <div className="not-prose">
      <div className="flex items-center gap-1.5 mb-6 border-b border-line/10 pb-3 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
              tab === t.key
                ? "bg-accent text-white shadow-[0_0_12px_rgba(255,6,6,0.3)]"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "published" && <MDXContent code={publishedCode} />}

      {tab === "liturgical" && (
        <VerseScripture rawContent={rawContent} bookTitle={bookTitle} variant="liturgical" />
      )}

      {tab === "unedited" && scriptureFilename && (
        <RawScripture filename={scriptureFilename} inline />
      )}

      {tab === "scripture" && letterImages.length > 0 && (
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-widest text-text-muted font-medium">
            The handwritten source
          </p>
          {letterImages.map((filename, i) => (
            <div
              key={filename}
              className="rounded-xl overflow-hidden border border-line bg-surface"
              style={{ boxShadow: "0 0 40px rgba(255,6,6,0.12)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/letters/${filename}`}
                alt={`Handwritten letter — page ${i + 1}`}
                className="w-full h-auto block"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
