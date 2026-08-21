"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Sigil from "@/components/Sigil";

const SigilCanvas = dynamic(() => import("./SigilCanvas"), {
  ssr: false,
  loading: () => null,
});

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * SSR-safe 3D sigil: the static glowing SVG always renders first (it is the
 * LCP element and the no-WebGL fallback). The interactive 3D canvas mounts on
 * top as soon as it's in view — WebGL support and reduced-motion are
 * deliberately NOT gated here; the r3f Canvas `fallback` + SceneBoundary keep
 * the SVG if WebGL is genuinely unavailable.
 */
export default function Sigil3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "150px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mounted = inView;

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label="The MeyGOD sigil — a spinning, glowing red hexagram with a white eye and dark pupil."
      style={{ position: "relative", aspectRatio: "200 / 155" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
        style={{ opacity: mounted && live ? 0 : 1 }}
      >
        <div className="h-[62%] w-[62%] [&_svg]:h-full [&_svg]:w-full" aria-hidden="true">
          <Sigil size={240} />
        </div>
      </div>

      {mounted && (
        <div className="absolute inset-0">
          <SceneBoundary>
            <SigilCanvas onLive={() => setLive(true)} />
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
