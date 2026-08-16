interface BloodQuoteProps {
  source: string;
  children: React.ReactNode;
}

export function BloodQuote({ source, children }: BloodQuoteProps) {
  return (
    <figure className="blood-quote not-prose my-10 relative overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] px-6 py-8 sm:px-10 sm:py-10">
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-2 select-none font-serif text-7xl leading-none text-[var(--color-accent)] opacity-25 sm:left-6 sm:text-8xl"
        style={{
          fontFamily: "var(--font-gospel)",
          textShadow: "0 0 30px rgba(255,6,6,0.4)",
        }}
      >
        “
      </span>

      <blockquote
        className="relative z-10 m-0 text-center text-xl leading-relaxed sm:text-2xl sm:leading-relaxed"
        style={{
          fontFamily: "var(--font-gospel)",
          color: "var(--color-accent)",
          textShadow:
            "0 0 18px rgba(255,6,6,0.55), 0 0 40px rgba(255,6,6,0.28), 0 2px 0 rgba(80,0,0,0.45)",
        }}
      >
        <div className="blood-quote-text space-y-4 [&_p]:m-0">{children}</div>
      </blockquote>

      <figcaption className="relative z-10 mt-6 text-right font-heading text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        — {source}
      </figcaption>

      <span aria-hidden className="blood-drip blood-drip-1" />
      <span aria-hidden className="blood-drip blood-drip-2" />
      <span aria-hidden className="blood-drip blood-drip-3" />
    </figure>
  );
}
