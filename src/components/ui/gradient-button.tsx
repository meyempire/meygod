"use client";

import { useState } from "react";
import Link from "next/link";

interface GradientButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
}

const SIZES = {
  sm: "px-5 py-2 text-xs",
  md: "px-8 py-3 text-sm",
  lg: "px-10 py-4 text-base",
};

const GRADIENT =
  "linear-gradient(90deg, #ff3939 0%, #5c0808 30%, #ff0606 50%, #5c0808 70%, #ff3939 100%)";

export function GradientButton({ children, href, onClick, className = "", size = "md", type = "button", disabled = false }: GradientButtonProps) {
  const [hovered, setHovered] = useState(false);
  const slots = SIZES[size];

  const inner = (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative inline-flex items-center justify-center rounded-xl border-none font-bold tracking-wider text-white cursor-pointer overflow-hidden select-none
        transition-[transform] duration-[0.25s] ease-out
        hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]
        focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-accent)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${slots} ${className}`}
      style={{
        backgroundImage: GRADIENT,
        backgroundSize: "300% auto",
        backgroundPosition: hovered ? "100% center" : "0% center",
        boxShadow: "0 12px 30px -10px rgba(255,6,6,0.55)",
        transition: "background-position 1.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.25s ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
      <span
        className="pointer-events-none absolute top-0 bottom-0 w-[22%] bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-[18deg]
          transition-[left] duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ left: hovered ? "120%" : "-30%" }}
      />
    </span>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}
