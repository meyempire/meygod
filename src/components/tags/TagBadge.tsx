import Link from "next/link";
import DreamIcon from "@/components/DreamIcon";

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

  const isDream = tag === "dream";
  const baseClasses = isDream
    ? "bg-gradient-to-r from-purple-500/15 to-fuchsia-500/10 text-purple-300 border border-purple-500/25 shadow-[0_0_8px_rgba(147,51,234,0.15)] hover:bg-purple-500/25 hover:text-purple-200 hover:border-purple-400/40 hover:shadow-[0_0_14px_rgba(147,51,234,0.3)]"
    : active
    ? "bg-accent/15 text-accent-2 border border-accent/30"
    : "bg-surface/80 text-text-muted border border-line/20 hover:bg-accent/10 hover:text-accent-2 hover:border-accent/30";

  const badge = (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200 ${sizeClasses} ${baseClasses}`}
    >
      {isDream && <DreamIcon className="w-3 h-3 text-purple-300" />}
      #{tag}
      {count !== undefined && <span className="text-xs opacity-60">({count})</span>}
    </span>
  );

  if (linkable) {
    return <Link href={`/revelations/tag/${tag}`}>{badge}</Link>;
  }

  return badge;
}
