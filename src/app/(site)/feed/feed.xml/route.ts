import { getFeed } from "../assemble";

export const revalidate = 600;

export async function GET() {
  const feed = await getFeed();
  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
