"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { BorderBeam } from "@/components/ui/border-beam";

interface StoneButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const STONE_GRADIENT =
  "linear-gradient(90deg, #a01010 0%, #620808 30%, #8a0808 50%, #620808 70%, #a01010 100%)";

const BASE =
  "relative inline-flex items-center justify-center rounded-xl overflow-hidden font-bold tracking-wider text-white px-8 py-3 text-sm transition-[background-position,transform] duration-[3s,0.25s] ease-[cubic-bezier(0.22,1,0.36,1),ease] hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]";

export function StoneButton({ children, href, onClick, className = "", type = "button", disabled = false }: StoneButtonProps) {
  const [hovered, setHovered] = useState(false);
  const beamRef = useRef<JSX.Element | null>(null);
  if (!beamRef.current) {
    beamRef.current = <BorderBeam size={80} duration={8} colorFrom="#ff0606" colorTo="#ff0606" borderWidth={0.5} delay={2} />;
  }

  const style = {
    backgroundImage: STONE_GRADIENT,
    backgroundSize: "300% auto",
    backgroundPosition: hovered ? "100% center" : "0% center",
    border: "2px solid #2a1515",
    boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
    WebkitTapHighlightColor: "transparent",
  };

  const cls = `${BASE} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`;
  const mouse = {
    onMouseEnter: () => { if (!disabled) setHovered(true); },
    onMouseLeave: () => { if (!disabled) setHovered(false); },
  };

  const content = (
    <>
      {beamRef.current}
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} style={style} {...mouse}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style} {...mouse}>
      {content}
    </button>
  );
}
