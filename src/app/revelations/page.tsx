import { getPosts, getAllTags, getAllCategories } from "@/lib/posts";
import { getDreamCards } from "@/lib/dreams";
import { POSTS_PER_PAGE } from "@/lib/constants";
import RevelationsClient from "./RevelationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revelations",
  description: "The scriptures of a new faith.",
};

export default async function RevelationsPage() {
  const posts = getPosts();
  let dreams: any[] = [];
  try {
    dreams = await getDreamCards();
  } catch {
    // Supabase unavailable during build
  }

  const unifiedPosts = [...posts, ...dreams]
    .map((p: any) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      tags: p.tags,
      category: p.category,
      readingTime: p.readingTime,
      isDream: p.isDream || false,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(unifiedPosts.length / POSTS_PER_PAGE);

  const allTags = getAllTags();
  const dreamCount = dreams.length;
  const tagMap = new Map(allTags.map((t) => [t.tag, t.count]));
  tagMap.set("dream", (tagMap.get("dream") || 0) + dreamCount);
  const mergedTags = Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const catMap = new Map(getAllCategories().map((c) => [c.category, c.count]));
  catMap.set("Dreams", (catMap.get("Dreams") || 0) + dreamCount);
  const mergedCategories = Array.from(catMap.entries()).map(([category, count]) => ({ category, count }));

  return (
    <RevelationsClient
      posts={unifiedPosts}
      allTags={mergedTags}
      allCategories={mergedCategories}
    />
  );
}
