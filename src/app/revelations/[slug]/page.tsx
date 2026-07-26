import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/posts";
import { getDream, getDreams, getDreamCards } from "@/lib/dreams";
import Link from "next/link";
import { TableOfContents } from "@/components/navigation/TableOfContents";
import { extractHeadings } from "@/lib/toc";
import { BackToTop } from "@/components/navigation/BackToTop";
import { ScrollProgress } from "@/components/navigation/ScrollProgress";
import PostHeader from "@/components/post/PostHeader";
import RelatedPosts from "@/components/post/RelatedPosts";
import { DreamTabs } from "@/components/post/DreamTabs";
import { RevelationTabs } from "@/components/post/RevelationTabs";
import { ShareButtons } from "@/components/ShareButtons";
import { ConfessionSection } from "@/components/ConfessionSection";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [posts, dreams] = await Promise.all([Promise.resolve(getPosts()), getDreams()]);
  return [
    ...posts.map((p) => ({ slug: p.slug })),
    ...dreams.map((d) => ({ slug: d.slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug) || await getDream(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `${SITE_URL}/revelations/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug) || await getDream(slug);
  if (!post) notFound();

  const [velitePosts, dreamCards] = await Promise.all([Promise.resolve(getPosts()), getDreamCards()]);
  const sorted = [...velitePosts, ...dreamCards].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentIndex = sorted.findIndex((p) => p.slug === slug);
  const previousPost = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? sorted[currentIndex - 1] : null;

  const isDream = (post as any).isDream === true;

  const rawToc = (post as any).toc || extractHeadings((post as any).raw || (post as any).content || "");
  const toc = rawToc.map((entry: any) => ({
    id: entry.id || entry.url?.replace("#", "") || "",
    text: entry.text || entry.value || "",
    depth: entry.depth || 2,
  }));

  const postUrl = `${SITE_URL}/revelations/${slug}`;

  const articleBody = (
    <>
      <PostHeader post={post as any} />

      {isDream ? (
        <DreamTabs
          revelation={(post as any).content}
          analyses={(post as any).analyses || []}
        />
      ) : (
        <RevelationTabs
          publishedCode={(post as any).code}
          rawContent={(post as any).raw || ""}
          bookTitle={post.title}
          scriptureFilename={(post as any).scripture || ""}
        />
      )}

      <div className="mt-8 flex justify-between items-center text-xs">
        {previousPost ? (
          <Link href={`/revelations/${previousPost.slug}`} className="text-text-muted hover:text-accent transition-colors text-left max-w-[48%] truncate">
            ← {previousPost.title}
          </Link>
        ) : <span />}
        {nextPost ? (
          <Link href={`/revelations/${nextPost.slug}`} className="text-text-muted hover:text-accent transition-colors text-right max-w-[48%] truncate">
            {nextPost.title} →
          </Link>
        ) : <span />}
      </div>

      <div className="mt-8">
        <ShareButtons title={post.title} url={postUrl} />
      </div>

      {isDream && (
        <div className="mt-6 not-prose">
          <a
            href={`https://mindfullucidity.vercel.app/journal/${(post as any).mindfullucidityId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            Recorded in MindfulLucidity →
          </a>
        </div>
      )}
    </>
  );

  return (
    <>
      <ScrollProgress />
      {toc.length > 0 ? (
        <div className="relative flex gap-10 max-w-[1200px] mx-auto px-6 pt-28 sm:pt-28 pb-12 sm:pb-24">
          <article
            className="flex-1 min-w-0 max-w-3xl rounded-2xl pt-12 sm:pt-16 px-6 sm:px-10 pb-6 sm:pb-10"
            style={{
              background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
              border: "2px solid #2a1515",
              boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
            }}
          >
            {articleBody}
          </article>
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <TableOfContents headings={toc} />
          </aside>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-6 pt-28 sm:pt-28 pb-12 sm:pb-24">
          <article
            className="rounded-2xl pt-12 sm:pt-16 px-6 sm:px-10 pb-6 sm:pb-10"
            style={{
              background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
              border: "2px solid #2a1515",
              boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
            }}
          >
            {articleBody}
          </article>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <div
          className="rounded-2xl p-6 sm:p-10"
          style={{
            background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
            border: "2px solid #2a1515",
            boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
          }}
        >
          <ConfessionSection pageSlug={slug} />
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-6">
        <RelatedPosts slug={slug} />
      </div>
      <BackToTop />
      <JsonLd post={post as any} />
    </>
  );
}
