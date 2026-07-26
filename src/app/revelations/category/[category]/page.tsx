import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import PostCard from "@/components/post/PostCard";
import Container from "@/components/ui/Container";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return getAllCategories().map(({ category }) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `Category: ${category}`,
    description: `All blog posts in ${category}.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();

  return (
    <Container>
      <div className="py-16 sm:py-24">
        <h1 className="section-title text-center">Category: {category}</h1>
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
