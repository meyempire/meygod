"use client";

import { useEffect, useState } from "react";

interface RawScriptureProps {
  filename: string;
  inline?: boolean;
}

export function RawScripture({ filename, inline }: RawScriptureProps) {
  const [text, setText] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!filename) return;
    if (inline || open) {
      fetch(`/scripture/${filename}`)
        .then((r) => r.text())
        .then(setText);
    }
  }, [open, filename, inline]);

  if (!filename) return null;

  if (inline) {
    return (
      <pre className="p-4 bg-surface rounded-lg border border-line/20 text-xs text-text-muted whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto font-mono leading-relaxed">
        {text || "Loading..."}
      </pre>
    );
  }

  return (
    <details
      className="mt-12 pt-8 border-t border-line/10 not-prose"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer text-xs uppercase tracking-widest text-text-muted hover:text-text transition-colors font-medium">
        The Unedited Word
      </summary>
      <pre className="mt-4 p-4 bg-surface rounded-lg border border-line/20 text-xs text-text-muted whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto font-mono leading-relaxed">
        {text || "Loading..."}
      </pre>
    </details>
  );
}
