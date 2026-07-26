import { getRelatedPosts } from "@/lib/posts";
import PostCard from "./PostCard";

interface RelatedPostsProps {
  slug: string;
  limit?: number;
}

export default function RelatedPosts({ slug, limit = 3 }: RelatedPostsProps) {
  const posts = getRelatedPosts(slug, limit);
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-line/10">
      <h2 className="text-xl font-bold text-text mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
