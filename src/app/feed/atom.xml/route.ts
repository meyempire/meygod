import { getFeed } from "../assemble";

export const revalidate = 600;

export async function GET() {
  const feed = await getFeed();
  return new Response(feed.atom1(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
