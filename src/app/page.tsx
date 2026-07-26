import Link from "next/link";
import Container from "@/components/ui/Container";
import PostCard from "@/components/post/PostCard";
import { HeroSection } from "@/components/HeroSection";
import TheCoin from "@/components/TheCoin";
import { AltarConfession } from "@/components/ConfessionSection";
import { getPosts } from "@/lib/posts";
import { StoneButton } from "@/components/ui/stone-button";

export default function HomePage() {
  const recentPosts = getPosts().slice(0, 6);

  return (
    <Container>
      <HeroSection />

      <TheCoin />

      <section className="mb-16 text-center">
        <h2 className="section-title">The Podcast</h2>
        <p className="section-subtitle">God speaks. A voice in the wilderness.</p>
        <StoneButton href="#">Listen Now (Link Coming Soon)</StoneButton>
      </section>

      <section className="mb-16">
        <h2 className="section-title text-center">Recent Revelations</h2>
        <p className="section-subtitle">Words for those who dare to overcome.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post, i) => (
            <PostCard key={post.slug} post={post} featured={i === 0} />
          ))}
        </div>
        {recentPosts.length > 0 && (
          <div className="text-center mt-10">
            <Link href="/revelations" className="text-accent hover:text-accent-2 transition-colors font-medium">
              All revelations →
            </Link>
          </div>
        )}
      </section>

      <section className="mb-16">
        <AltarConfession />
      </section>
    </Container>
  );
}
