import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags } from "@/lib/posts";
import PostCard from "@/components/post/PostCard";
import Container from "@/components/ui/Container";

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts tagged "${tag}"`,
    description: `All blog posts tagged with ${tag}.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <Container>
      <div className="py-16 sm:py-24">
        <h1 className="section-title text-center">Tag: {tag}</h1>
        <p className="section-subtitle">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </Container>
  );
}
