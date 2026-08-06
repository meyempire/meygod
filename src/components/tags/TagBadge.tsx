import Link from "next/link";

interface TagBadgeProps {
  tag: string;
  size?: "sm" | "md";
  active?: boolean;
  count?: number;
  linkable?: boolean;
}

export default function TagBadge({
  tag,
  size = "md",
  active = false,
  count,
  linkable = true,
}: TagBadgeProps) {
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";

  const baseClasses = active
    ? "bg-accent/15 text-accent-2 border border-accent/30"
    : "bg-surface/80 text-text-muted border border-line/20 hover:bg-accent/10 hover:text-accent-2 hover:border-accent/30";

  const badge = (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 ${sizeClasses} ${baseClasses}`}
    >
      #{tag}
      {count !== undefined && <span className="text-xs opacity-60">({count})</span>}
    </span>
  );

  if (linkable) {
    return <Link href={`/revelations/tag/${tag}`}>{badge}</Link>;
  }

  return badge;
}
