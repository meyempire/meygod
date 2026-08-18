import { cn } from "@/lib/utils";

interface BloodQuoteProps {
  children: React.ReactNode;
  source?: string;
  blood?: boolean;
  className?: string;
}

const quoteGlyphStyle = (blood: boolean): React.CSSProperties =>
  blood
    ? {
        color: "var(--color-accent)",
        textShadow:
          "0 0 30px rgba(255,6,6,0.45), 0 0 70px rgba(255,6,6,0.2)",
        opacity: 0.9,
      }
    : {
        color: "var(--color-text-muted)",
        opacity: 0.4,
      };

export function BloodQuote({ children, source, blood = true, className }: BloodQuoteProps) {
  const glyphStyle = quoteGlyphStyle(blood);

  return (
    <figure className={cn("not-prose relative my-12", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: blood
            ? "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(255,6,6,0.10), transparent 70%)"
            : "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(255,255,255,0.03), transparent 70%)",
        }}
      />

      <span
        aria-hidden
        className="absolute -left-2 -top-2 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 sm:h-10 sm:w-10"
        style={{ borderColor: blood ? "rgba(255,6,6,0.55)" : "var(--color-line)" }}
      />
      <span
        aria-hidden
        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-br-lg border-b-2 border-r-2 sm:h-10 sm:w-10"
        style={{ borderColor: blood ? "rgba(255,6,6,0.55)" : "var(--color-line)" }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -top-9 left-0 select-none font-serif text-8xl leading-none sm:text-9xl"
        style={{ ...glyphStyle, fontFamily: "Georgia, serif" }}
      >
        “
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-12 right-0 select-none font-serif text-8xl leading-none sm:text-9xl"
        style={{ ...glyphStyle, fontFamily: "Georgia, serif" }}
      >
        ”
      </span>

      <blockquote
        className={cn(
          "relative z-10 mx-auto max-w-2xl px-8 py-10 text-center text-base sm:px-12 sm:py-12",
          blood ? "leading-loose" : "leading-relaxed",
        )}
        style={
          blood
            ? {
                fontFamily: "var(--font-blood)",
                color: "var(--color-accent)",
                textShadow:
                  "0 0 10px rgba(255,6,6,0.35), 0 0 24px rgba(255,6,6,0.15)",
              }
            : {
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
              }
        }
      >
        <div className="space-y-4 [&_p]:m-0">{children}</div>
      </blockquote>

      {source && (
        <figcaption
          className="relative z-10 mt-4 text-center font-heading text-xs font-semibold uppercase tracking-[0.22em]"
          style={{
            color: blood ? "var(--color-accent-2)" : "var(--color-text-muted)",
            textShadow: blood ? "0 0 6px rgba(255,6,6,0.25)" : "none",
          }}
        >
          — {source}
        </figcaption>
      )}
    </figure>
  );
}
