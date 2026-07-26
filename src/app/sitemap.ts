import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { getDreamCards } from "@/lib/dreams";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, dreams] = await Promise.all([Promise.resolve(getPosts()), getDreamCards()]);

  const all = [...posts, ...dreams];

  const postRoutes: MetadataRoute.Sitemap = all.map((post) => ({
    url: `${SITE_URL}/revelations/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const allTags = new Set<string>();
  all.forEach((p) => p.tags.forEach((t) => allTags.add(t)));
  allTags.add("dream");

  const tagRoutes: MetadataRoute.Sitemap = Array.from(allTags).map((tag) => ({
    url: `${SITE_URL}/revelations/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/revelations`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/creed`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...postRoutes,
    ...tagRoutes,
  ];
}
