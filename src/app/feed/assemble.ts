import { Feed } from "feed";
import { getPosts } from "@/lib/posts";
import { getDreamCards } from "@/lib/dreams";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

export async function getFeed(): Promise<Feed> {
  const feed = new Feed({
    title: "MeyGOD — A Voice in the Wilderness",
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    image: `${SITE_URL}/favicon.svg`,
    favicon: `${SITE_URL}/favicon.svg`,
    copyright: `All rights reserved ${new Date().getFullYear()}, MeyGOD`,
    updated: new Date(),
    generator: "Next.js using Feed for Node.js",
    feedLinks: {
      rss: `${SITE_URL}/feed/feed.xml`,
      atom: `${SITE_URL}/feed/atom.xml`,
      json: `${SITE_URL}/feed/feed.json`,
    },
    author: {
      name: "MeyGOD",
      email: "meygod@meygod.com",
      link: SITE_URL,
    },
  });

  let dreams: any[] = [];
  try {
    dreams = await getDreamCards();
  } catch {
    // Supabase unavailable during build
  }
  const posts = getPosts();

  const allPosts = [...posts, ...dreams]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50);

  for (const post of allPosts) {
    const url = `${SITE_URL}/revelations/${post.slug}`;
    feed.addItem({
      title: (post as any).isDream ? `Dream — ${post.title}` : post.title,
      id: url,
      link: url,
      description: post.description,
      date: new Date(post.date),
      category: post.tags.map((tag: string) => ({ name: tag })),
    });
  }

  return feed;
}
