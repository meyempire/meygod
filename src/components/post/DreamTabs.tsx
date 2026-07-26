"use client";

import { useState } from "react";

interface DreamTabsProps {
  revelation: string;
  analyses: { type: string; title: string; content: string }[];
}

type Tab = "revelation" | "analysis";

export function DreamTabs({ revelation, analyses }: DreamTabsProps) {
  const [tab, setTab] = useState<Tab>("revelation");

  const tabs: { key: Tab; label: string }[] = [
    { key: "revelation", label: "Revelation" },
    { key: "analysis", label: "Analysis" },
  ];

  return (
    <div className="not-prose">
      <div className="flex items-center gap-1.5 mb-6 border-b border-line/10 pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              tab === t.key
                ? "bg-accent text-white shadow-[0_0_12px_rgba(255,6,6,0.3)]"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "revelation" && (
        <div className="prose max-w-none">{typeof revelation === "string" ? <div dangerouslySetInnerHTML={{ __html: revelation }} /> : revelation}</div>
      )}

      {tab === "analysis" && (
        <div className="space-y-6">
          {analyses.length === 0 && (
            <p className="text-text-muted text-sm">No analyses recorded.</p>
          )}
          {analyses.map((a, i) => (
            <div key={i} className="p-5 rounded-xl bg-surface/90 border border-purple-500/15">
              <p className="text-xs uppercase tracking-widest mb-2 text-purple-400 font-medium">
                {a.type} · {a.title}
              </p>
              <div className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                {a.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
