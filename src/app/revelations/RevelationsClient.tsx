"use client";

import { useState, useMemo } from "react";
import Container from "@/components/ui/Container";
import Sigil from "@/components/Sigil";
import PostCard from "@/components/post/PostCard";
import TagBadge from "@/components/tags/TagBadge";
import { SearchRevelations } from "@/components/search/SearchRevelations";
import { useRevelationPages } from "@/hooks/useRevelationPages";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type PostItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  readingTime: number;
  isDream?: boolean;
};

type Props = {
  posts: PostItem[];
  allTags: { tag: string; count: number }[];
  allCategories: { category: string; count: number }[];
};

function BrandedTitle() {
  return (
    <span style={{ textTransform: "none" }}>
      <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)" }}>Mey</span>
      <span style={{ fontFamily: "var(--font-god)", color: "var(--color-accent)", textShadow: "0 0 12px rgba(255,6,6,0.5), 0 0 30px rgba(255,6,6,0.2)" }}>GOD</span>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--color-text-muted)" }}> Revelations</span>
    </span>
  );
}

export default function RevelationsClient({ posts, allTags, allCategories }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "revelations" | "dreams">("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = posts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (typeFilter === "revelations") result = result.filter((p) => !p.isDream);
    else if (typeFilter === "dreams") result = result.filter((p) => p.isDream);
    if (selectedTag) result = result.filter((p) => p.tags.includes(selectedTag));
    if (selectedCategory) result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    return result;
  }, [posts, search, typeFilter, selectedTag, selectedCategory]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRevelationPages(filtered);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const sentinelRef = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });

  return (
    <Container>
      <div className="py-16 sm:py-24">
        <div className="flex items-center justify-center gap-4 my-8">
          <Sigil size={48} />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">
            <BrandedTitle />
          </h1>
        </div>
        <p className="section-subtitle">The scriptures of a new faith.</p>

        <div className="mb-6">
          <SearchRevelations onSearch={setSearch} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {allTags.slice(0, 15).map(({ tag: t, count }) => (
            <span key={t} onClick={() => setSelectedTag(selectedTag === t ? null : t)}>
              <TagBadge tag={t} count={count} active={selectedTag === t} size="sm" linkable={false} />
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {items.map((post, i) => (
            <PostCard key={post.slug} post={post as any} featured={i === 0} />
          ))}
        </div>

        {items.length === 0 && (
          <p className="text-center text-text-muted py-12">No revelations found.</p>
        )}

        <div ref={sentinelRef} className="h-1" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <p className="text-text-muted text-xs animate-pulse">Loading revelations...</p>
          </div>
        )}
      </div>
    </Container>
  );
}
