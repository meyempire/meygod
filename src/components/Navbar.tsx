"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import { BorderBeam } from "@/components/ui/border-beam";

const links = [
  { label: "Festival", href: "/festival", external: false },
  { label: "Altar", href: "/", external: false },
  { label: "Revelations", href: "/revelations", external: false },
  { label: "Creed", href: "/creed", external: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav
      className="hidden sm:flex fixed z-50 left-1/2 -translate-x-1/2 items-center rounded-[20px] px-6"
      style={{
        top: "20px",
        height: "68px",
        width: "calc(100% - 48px)",
        maxWidth: "1200px",
        background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
        border: "2px solid #2a1515",
        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
      }}
    >
      <div
        className="absolute top-0 left-[15%] right-[15%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,6,6,0.4), rgba(255,57,57,0.5), transparent)" }}
      />
      <Logo size={24} className="!gap-2" />
      <div className="flex items-center ml-6 gap-1" suppressHydrationWarning>
        {links.map((link) => {
          const isHome = pathname === "/";
          const active = link.href === "/" ? isHome : pathname.startsWith(link.href);
          const isFestival = link.href === "/festival";
          const cls = `relative text-xs font-medium uppercase tracking-wider py-2 px-3 rounded-lg transition-colors ${
            mounted && active ? "text-text bg-accent/8" : "text-text-muted hover:text-text hover:bg-accent/5"
          }`;
          if (isFestival) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cls}
                style={{ paddingTop: "6px", paddingBottom: "6px" }}
              >
                <span
                  className="flex flex-col items-center leading-none"
                  style={{ textTransform: "none" }}
                >
                  <span className="text-[15px] leading-none">
                    <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)" }}>Mey</span>
                    <span
                      style={{
                        fontFamily: "var(--font-god)",
                        color: "var(--color-accent)",
                        textShadow: "0 0 10px rgba(255,6,6,0.5), 0 0 24px rgba(255,6,6,0.2)",
                      }}
                    >
                      GOD
                    </span>
                  </span>
                  <span
                    className="text-[9px] leading-none"
                    style={{
                      fontFamily: "var(--font-god)",
                      color: "var(--color-accent)",
                      textShadow: "0 0 10px rgba(255,6,6,0.5), 0 0 24px rgba(255,6,6,0.2)",
                    }}
                  >
                    FESTIVAL
                  </span>
                </span>
              </Link>
            );
          }
          return (
            <Link key={link.href} href={link.href} className={cls}>
              {link.label}
            </Link>
          );
        })}
      </div>
      <BorderBeam size={150} duration={8} colorFrom="#ff0606" colorTo="#ff0606" delay={0} />
    </nav>
  );
}
