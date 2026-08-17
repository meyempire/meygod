"use client";

import Link from "next/link";
import BrandName from "@/components/BrandName";
import Sigil from "@/components/Sigil";
import { Countdown } from "@/components/festival/Countdown";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { FESTIVAL_DATE, FESTIVAL_DAY_LABEL, FESTIVAL_TAGLINE } from "@/lib/festival";

function SigilGlow({ size, children }: { size: number; children: React.ReactNode }) {
  const halo = size * 2.6;
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: halo,
          height: halo,
          background:
            "radial-gradient(circle, rgba(255,6,6,0.10) 0%, rgba(255,6,6,0.04) 45%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      {children}
    </div>
  );
}

export function CountdownClient() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-4 sm:py-8">
      <Link
        href="/festival"
        className="flex flex-col items-center"
        aria-label="Return to the festival"
      >
        <div className="sm:hidden">
          <SigilGlow size={110}>
            <Sigil size={110} />
          </SigilGlow>
        </div>
        <div className="hidden sm:block">
          <SigilGlow size={207}>
            <Sigil size={207} />
          </SigilGlow>
        </div>
        <div className="mt-26">
          <AnimatedShinyText
            shimmerWidth={180}
            gradientFrom="transparent"
            gradientVia="rgba(255,6,6,0.6)"
            gradientTo="transparent"
          >
            <BrandName className="text-5xl sm:text-6xl md:text-7xl" />
          </AnimatedShinyText>
        </div>
        <h1
          className="-mt-3 text-2xl sm:-mt-4 sm:text-4xl"
          style={{
            fontFamily: "var(--font-god)",
            color: "var(--color-accent)",
            textShadow: "0 0 20px rgba(255,6,6,0.5), 0 0 40px rgba(255,6,6,0.25)",
          }}
        >
          FESTIVAL
        </h1>
      </Link>
      <div className="mt-10">
        <Countdown target={FESTIVAL_DATE} size="lg" />
      </div>
      <div className="mt-4">
        <p className="text-text text-base sm:text-lg md:text-xl uppercase tracking-[0.35em] text-center">
          {FESTIVAL_TAGLINE}
        </p>
        <p className="mt-2 text-text-muted text-sm sm:text-base text-center">
          {FESTIVAL_DAY_LABEL}
        </p>
      </div>
    </div>
  );
}
