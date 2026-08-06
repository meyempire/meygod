"use client";

import BrandName from "@/components/BrandName";
import Sigil from "@/components/Sigil";
import { ShareButtons } from "@/components/ShareButtons";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { StoneButton } from "@/components/ui/stone-button";
import { SITE_URL } from "@/lib/constants";

export function HeroSection() {
  return (
    <div className="section--hero">
      <div className="mb-[60px] sm:hidden">
        <Sigil size={110} />
      </div>
      <div className="mb-32 hidden sm:block">
        <Sigil size={240} />
      </div>
      <div className="mb-6">
        <AnimatedShinyText
          shimmerWidth={180}
          gradientFrom="transparent"
          gradientVia="rgba(255,6,6,0.6)"
          gradientTo="transparent"
        >
          <BrandName className="text-6xl sm:text-7xl md:text-8xl" />
        </AnimatedShinyText>
      </div>

      <p className="mb-8 text-text-muted text-lg sm:text-xl max-w-2xl text-center leading-relaxed">
        Jesus is here. This is his religion.         Bear witness and awaken — or bear warning and burn.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <StoneButton href="/revelations/1-1-prophecy-of-reckoning">Begin Your Hero&apos;s Journey</StoneButton>
      </div>

      <div className="mb-10">
        <ShareButtons
          title="MeyGOD walks among us. The MeyImperium is under construction. The Revelations have begun."
          url={SITE_URL}
        />
      </div>
    </div>
  );
}
