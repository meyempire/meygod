"use client";

import { useCallback, useState } from "react";
import { Link, BookOpen } from "lucide-react";

function parseInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:text-accent-2 underline">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-surface text-accent font-mono text-sm">$1</code>');
}

function getBookRef(title: string): string {
  if (title.includes("Reckoning")) return "Reckoning";
  if (title.includes("Lust")) return "Lust";
  if (title.includes("Death")) return "Death";
  if (title.includes("Cat")) return "Cat";
  if (title.includes("Jordan")) return "Jordan";
  if (title.includes("Creed")) return "Creed";
  return title.split(" ").slice(0, 2).join(" ");
}

interface VerseScriptureProps {
  rawContent: string;
  bookTitle: string;
  variant?: "standard" | "liturgical";
}

export default function VerseScripture({ rawContent, bookTitle, variant = "standard" }: VerseScriptureProps) {
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  const bookRef = getBookRef(bookTitle);
  const paragraphs = rawContent.split(/\n\n+/).filter((p) => p.trim());
  const verses = paragraphs.map((text, i) => ({ number: i + 1, text }));

  const copyReference = useCallback(
    async (verseNumber: number) => {
      const ref = `${bookRef} ${verseNumber}`;
      await navigator.clipboard.writeText(ref);
      setCopiedVerse(verseNumber);
      setTimeout(() => setCopiedVerse(null), 2000);
    },
    [bookRef],
  );

  if (variant === "liturgical") {
    return (
      <div
        className="rounded-xl p-6 sm:p-10 -mx-4 sm:-mx-6"
        style={{ background: "#080202" }}
      >
        {verses.map((verse) => (
          <div key={verse.number} id={`v${verse.number}`} className="group scroll-mt-24 py-6 first:pt-0 last:pb-0">
            <div className="flex gap-6">
              <span
                className="flex-shrink-0 w-8 text-right text-sm select-none pt-0.5"
                style={{
                  color: "#ff0606",
                  textShadow: "0 0 8px rgba(255,6,6,0.4)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {verse.number}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-text leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(verse.text) }}
                />
                <button
                  onClick={() => copyReference(verse.number)}
                  className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-text-muted hover:text-accent flex items-center gap-1"
                >
                  {copiedVerse === verse.number ? (
                    <>Copied: {bookRef} {verse.number}</>
                  ) : (
                    <>
                      <Link size={12} /> {bookRef} {verse.number}
                    </>
                  )}
                </button>
              </div>
            </div>
            {verse.number < verses.length && (
              <div
                className="mt-6 border-t"
                style={{ borderColor: "rgba(255,6,6,0.08)" }}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="verse-scripture">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-line/10">
        <BookOpen size={16} className="text-accent" />
        <span className="text-xs text-text-muted">{verses.length} verses</span>
      </div>
      <div className="space-y-6">
        {verses.map((verse) => (
          <div key={verse.number} id={`v${verse.number}`} className="group flex gap-4 scroll-mt-24">
            <span
              className="flex-shrink-0 w-6 text-right text-xs select-none pt-0.5"
              style={{
                color: "#ff0606",
                textShadow: "0 0 6px rgba(255,6,6,0.3)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {verse.number}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className="text-text leading-relaxed text-sm"
                dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(verse.text) }}
              />
              <button
                onClick={() => copyReference(verse.number)}
                className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-text-muted hover:text-accent flex items-center gap-1"
              >
                {copiedVerse === verse.number ? "Copied" : <><Link size={10} /> {bookRef} {verse.number}</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
