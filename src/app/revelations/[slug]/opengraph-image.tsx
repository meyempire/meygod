import { ImageResponse } from "next/og";
import { getPost, getPosts } from "@/lib/posts";

export const alt = "Blog post cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          background: "linear-gradient(135deg, #0d0303 0%, #1a0505 100%)",
          fontFamily: "Chakra Petch",
          color: "#ffe2e2",
        }}
      >
        <div style={{ fontSize: 24, color: "#ff0606", letterSpacing: "6px", marginBottom: "24px", textTransform: "uppercase" }}>
          {post.category}
        </div>
        <div
          style={{
            fontSize: post.title.length > 60 ? 48 : 64,
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: "1040px",
            textShadow: "0 0 20px rgba(255,6,6,0.3)",
          }}
        >
          {post.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: "48px", fontSize: 28, opacity: 0.7 }}>
          <span style={{ color: "#ffffff" }}>Mey</span>
          <span style={{ color: "#ff0606" }}>GOD</span>
          <span style={{ marginLeft: "24px", fontSize: 22 }}>
            — A Voice in the Wilderness
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
