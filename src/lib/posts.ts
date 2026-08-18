import { posts as allPosts } from "#site/content";
import { parseScriptureRef } from "@/lib/letters";

export type Post = (typeof allPosts)[number];

export type ScriptureRef = { book: number; chapter: number; verse?: number };

export function scriptureRef(post: { scripture?: string | null }): ScriptureRef | null {
  if (!post.scripture) return null;
  return parseScriptureRef(post.scripture);
}

/** Letter posts by book DESC, chapter DESC, verse DESC; unnumbered / dreams by date DESC after. */
export function compareByScriptureNumber(
  a: { scripture?: string | null; date: string; isDream?: boolean },
  b: { scripture?: string | null; date: string; isDream?: boolean },
): number {
  const refA = a.isDream ? null : scriptureRef(a);
  const refB = b.isDream ? null : scriptureRef(b);

  if (refA && refB) {
    if (refA.book !== refB.book) return refB.book - refA.book;
    if (refA.chapter !== refB.chapter) return refB.chapter - refA.chapter;
    return (refB.verse || 0) - (refA.verse || 0);
  }
  if (refA) return -1;
  if (refB) return 1;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function getPosts(): Post[] {
  return allPosts
    .filter((p) => !p.draft)
    .sort(compareByScriptureNumber);
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
