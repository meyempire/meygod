import { posts as allPosts } from "#site/content";

export type Post = (typeof allPosts)[number];

export function getPosts(): Post[] {
  return allPosts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug && !p.draft);
}

export function getPostsByTag(tag: string): Post[] {
  return getPosts().filter((p) => p.tags.includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  return getPosts().filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getRelatedPosts(currentSlug: string, limit = 3): Post[] {
  const current = getPost(currentSlug);
  if (!current) return [];

  const allOthers = getPosts().filter((p) => p.slug !== currentSlug);
  const currentTags = new Set(current.tags || []);

  return allOthers
    .map((post) => ({
      post,
      score:
        post.tags.filter((t) => currentTags.has(t)).length * 10 -
        (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24 * 30),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  getPosts().forEach((post) => {
    post.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  getPosts().forEach((post) => {
    counts.set(post.category, (counts.get(post.category) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPaginatedPosts(page: number, perPage: number): { posts: Post[]; totalPages: number } {
  const all = getPosts();
  const totalPages = Math.ceil(all.length / perPage);
  const start = (page - 1) * perPage;
  return {
    posts: all.slice(start, start + perPage),
    totalPages,
  };
}
