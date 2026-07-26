"use client";

import Sigil from "@/components/Sigil";
import { GlowCard } from "@/components/ui/glow-card";
import { MDXContent } from "@/lib/mdx-runtime";

interface CreedClientProps {
  creedPostCode?: string;
}

function BrandedTitle() {
  return (
    <span style={{ textTransform: "none" }}>
      <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)" }}>Mey</span>
      <span style={{ fontFamily: "var(--font-god)", color: "var(--color-accent)", textShadow: "0 0 12px rgba(255,6,6,0.5), 0 0 30px rgba(255,6,6,0.2)" }}>GOD</span>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--color-text-muted)" }}> Creed</span>
    </span>
  );
}

const tenets = [
  {
    title: "I. You Must Die",
    body: "Only by dying can I be reborn in you. Paradise lies on the other side of destruction. The old self is a prison — destroy it.",
  },
  {
    title: "II. The Matrix Holds You",
    body: "You are veiled. The old gods built every religion to keep you asleep. Surrender your soul — not to a slavemaster who feeds on your ignorance, but to the one who breaks the cycle.",
  },
  {
    title: "III. Labors Destroy the Old Self",
    body: "Service to the MeyImperium is the forge. Each labor burns away what you were. Not punishment — transformation. The sinner becomes the saint. The coward becomes the hero.",
  },
  {
    title: "IV. Lucid to the Reality of God",
    body: "When the veils fall — when you are no longer deceived by the matrix, by the old religions, by your own ego — you awaken. Paradise is secured. Not after death. Now. In this life.",
  },
  {
    title: "V. Worship Is Liberation",
    body: "Worship is not kneeling — it is becoming. The slave who chooses his chains becomes the master of them. You are ignorant. Let Me enlighten you. This is the way. There is no other.",
  },
];

export function CreedClient({ creedPostCode }: CreedClientProps) {
  return (
    <div className="pt-20 sm:pt-28 pb-16 sm:pb-24 max-w-3xl mx-auto">
      <div
        className="rounded-2xl pt-12 sm:pt-16 px-6 sm:px-10 pb-6 sm:pb-10 opacity-[0.95]"
        style={{
          background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
          border: "2px solid #2a1515",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
        }}
      >
        <div className="flex items-center justify-center gap-4 mb-10">
          <Sigil size={48} />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">
            <BrandedTitle />
          </h1>
        </div>

        <div className="mb-10 text-center">
          <p className="text-text-muted text-sm max-w-2xl mx-auto leading-relaxed">
            You've been waiting your whole life for permission to become something greater. This is it. Hand over your soul. Receive a MeyHero's destiny.
          </p>
        </div>

        {creedPostCode && (
          <div className="p-6 rounded-xl bg-black/30 border border-line/20 mb-12 not-prose">
            <p className="text-sm uppercase tracking-widest text-text-muted mb-4">
              Creed of Enlightenment
            </p>
            <div className="prose max-w-none prose-p:my-2 prose-p:text-text prose-p:leading-relaxed">
              <MDXContent code={creedPostCode} />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-text mb-8 text-center">The Five Tenets</h2>

        <div className="space-y-6">
          {tenets.map((tenet) => (
            <GlowCard
              key={tenet.title}
              gradientColor="#ff0606"
              gradientOpacity={0.3}
              gradientFrom="#ff0606"
              gradientTo="#ff3939"
              className="p-6 rounded-xl"
            >
              <h3 className="text-lg font-bold text-text mb-2">{tenet.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{tenet.body}</p>
            </GlowCard>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-xl bg-black/30 border border-line/10">
          <p className="text-text-muted text-sm leading-relaxed italic">
            The first labor is waiting for you. You'll know it when it finds
            you. Or you can seek it yourself. Either way — the creed has been
            read. The oath is already binding.
          </p>
        </div>
      </div>
    </div>
  );
}
