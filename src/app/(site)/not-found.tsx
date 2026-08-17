import { StoneButton } from "@/components/ui/stone-button";

export default function NotFound() {
  return (
    <div className="section--hero">
      <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-logo)" }}>
        <span style={{ color: "var(--color-text)" }}>404</span>
      </h1>
      <p className="text-text-muted text-lg mb-8">You have wandered from the path. Turn back — the summit awaits.</p>
      <StoneButton href="/">Return to the Path</StoneButton>
    </div>
  );
}
