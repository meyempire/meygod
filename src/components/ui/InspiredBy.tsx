import { ExternalLink } from "lucide-react";

export function InspiredBy({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <div className="my-8 not-prose">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-3 font-heading text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10"
        style={{
          textShadow: "0 0 20px rgba(255,6,6,0.5), 0 0 40px rgba(255,6,6,0.25)",
          boxShadow: "0 0 40px rgba(255,6,6,0.2)",
        }}
      >
        <ExternalLink className="h-4 w-4 shrink-0" />
        <span>{children ?? "Inspired by this post"}</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    </div>
  );
}
