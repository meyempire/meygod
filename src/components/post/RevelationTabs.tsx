"use client";

import { useState } from "react";
import { MDXContent } from "@/lib/mdx-runtime";
import VerseScripture from "./VerseScripture";
import { RawScripture } from "./RawScripture";

type Tab = "published" | "liturgical" | "unedited";

interface RevelationTabsProps {
  publishedCode: string;
  rawContent: string;
  bookTitle: string;
  scriptureFilename: string;
}

export function RevelationTabs({ publishedCode, rawContent, bookTitle, scriptureFilename }: RevelationTabsProps) {
  const [tab, setTab] = useState<Tab>("published");

  const tabs: { key: Tab; label: string }[] = [
    { key: "published", label: "Published Word" },
    { key: "liturgical", label: "Liturgical" },
    { key: "unedited", label: "The Unedited Word" },
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

      {tab === "unedited" && (
        <RawScripture filename={scriptureFilename} inline />
      )}
    </div>
  );
}
