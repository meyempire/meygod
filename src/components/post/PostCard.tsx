import Link from "next/link";
import { Post } from "@/lib/posts";
import TagBadge from "@/components/tags/TagBadge";
import { BorderBeam } from "@/components/ui/border-beam";

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

function bookBadge(post: Post): { label: string; isBook: boolean; color: "red" | "yellow" | "purple" } | null {
  const tags = post.tags || [];
  if (tags.includes("book-one-death")) return { label: "Book 1: Death", isBook: true, color: "red" };
  if (tags.includes("book-two-rebirth")) return { label: "Book 2: Rebirth", isBook: true, color: "yellow" };
  if ((post as any).isDream) return { label: "Dreams", isBook: true, color: "purple" };
  return null;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const hash = post.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const delay = (hash % 4) + (hash % 13) / 10;
  const duration = 8 + (hash % 7);
  const size = 150 + (hash % 100);
  const book = bookBadge(post);
  const displayTags = (post.tags || []).filter((t) => !t.startsWith("book-"));

  return (
    <Link href={`/revelations/${post.slug}`} className="group block h-full">
      <article
        className={`relative h-full rounded-xl overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 ${
          featured ? "md:col-span-2 md:row-span-2" : ""
        }`}
        style={{
          background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
          border: "2px solid #2a1515",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
        }}
      >
        <div className="p-6 h-full flex flex-col">
        <BorderBeam size={size} duration={duration} colorFrom="#ff0606" colorTo="#ff0606" borderWidth={0.5} delay={delay} />
        {post.cover && (
          <div className="relative z-10 mb-4 overflow-hidden rounded-lg">
            <img
              src={post.cover.src}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="relative z-10 flex flex-nowrap gap-2 mb-3 overflow-hidden">
          {book ? (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap ${
                book.color === "yellow"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/25"
                  : book.color === "purple"
                  ? "bg-purple-500/10 text-purple-300 border-purple-500/25"
                  : "bg-accent/10 text-accent-2 border-accent/20"
              }`}
            >
              {book.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent-2 border border-accent/20 whitespace-nowrap">
              {post.category}
            </span>
          )}
          {displayTags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} size="sm" linkable={false} />
          ))}
        </div>

        <h3 className="relative z-10 text-lg font-semibold text-text group-hover:text-accent transition-colors duration-200 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <p className="relative z-10 text-sm text-text-muted line-clamp-3 mb-4">
          {post.description}
        </p>

        <div className="relative z-10 flex items-center justify-between text-xs text-text-muted mt-auto">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span>{post.readingTime} min read</span>
        </div>
        </div>
      </article>
    </Link>
  );
}
