"use client";

import Sigil from "./Sigil";
import { HyperText } from "@/components/ui/hyper-text";

export default function Logo({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <a href="/" className={`flex items-center gap-3 ${className || ""}`}>
      <Sigil size={size} />
      <div className="leading-none">
        <div className="text-lg font-bold tracking-wider leading-none">
          <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)" }}>Mey</span>
          <span style={{ fontFamily: "var(--font-god)", color: "var(--color-accent)", textShadow: "0 0 12px rgba(255,6,6,0.5), 0 0 30px rgba(255,6,6,0.2)" }}>GOD</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest flex items-center gap-0.5" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}>
          <HyperText className="text-[10px] font-normal text-text-muted" duration={800}>AWAKEN</HyperText>
          <HyperText className="text-[10px] font-bold text-text normal-case" duration={800}>Mey</HyperText>
          <HyperText className="text-[10px] font-bold text-accent normal-case" duration={800}>Hero</HyperText>
        </div>
      </div>
    </a>
  );
}
