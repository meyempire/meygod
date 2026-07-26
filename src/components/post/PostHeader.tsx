import { Post } from "@/lib/posts";
import TagBadge from "@/components/tags/TagBadge";

interface PostHeaderProps {
  post: Post;
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-10">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-2 border border-accent/20">
          {post.category}
        </span>
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} linkable={false} />
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-4">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {post.updated && post.updated !== post.date && (
          <span>
            · Updated{" "}
            {new Date(post.updated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        )}
        <span>·</span>
        <span>{post.readingTime} min read</span>
        <span>·</span>
        <span>{post.wordCount.toLocaleString()} words</span>
      </div>

      {post.cover && (
        <div className="mt-6 overflow-hidden rounded-xl border border-line/20">
          <img
            src={post.cover.src}
            alt={post.title}
            className="w-full object-cover max-h-96"
          />
        </div>
      )}
    </header>
  );
}
