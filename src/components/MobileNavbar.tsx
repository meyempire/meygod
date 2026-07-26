"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Sigil from "./Sigil";
import { HyperText } from "@/components/ui/hyper-text";

export default function MobileNavbar() {
  const pathname = usePathname();
  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <div className="sm:hidden fixed z-50 top-3 w-[calc(100vw-1rem)] left-2 min-w-0">
      <div
        className="flex items-center justify-between rounded-2xl px-3 py-2 w-full"
        style={{
          background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
          border: "2px solid #2a1515",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <Sigil size={18} />
          <div className="leading-none">
            <div className="text-sm font-bold tracking-wider leading-none">
              <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)" }}>Mey</span>
              <span style={{ fontFamily: "var(--font-god)", color: "var(--color-accent)", textShadow: "0 0 10px rgba(255,6,6,0.5)" }}>GOD</span>
            </div>
            <div className="text-[8px] uppercase tracking-widest text-text-muted flex items-center gap-0.5" style={{ fontFamily: "var(--font-body)" }}>
              <HyperText className="text-[8px] font-normal text-text-muted" duration={600}>AWAKEN</HyperText>
              <HyperText className="text-[8px] font-bold text-text normal-case" duration={600}>Mey</HyperText>
              <HyperText className="text-[8px] font-bold text-accent normal-case" duration={600}>Hero</HyperText>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/revelations" className={`text-[10px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${active("/revelations") ? "text-text" : "text-text-muted hover:text-text"}`}>
            Revelations
          </Link>
          <Link href="/creed" className={`text-[10px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors ${active("/creed") ? "text-text" : "text-text-muted hover:text-text"}`}>
            Creed
          </Link>
        </div>
      </div>
    </div>
  );
}
