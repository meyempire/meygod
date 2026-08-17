"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  target: string; // ISO datetime
  doneLabel?: string;
  size?: "md" | "lg";
}

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diff(target: number): Parts {
  const delta = target - Date.now();
  if (delta <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(delta / 86_400_000),
    hours: Math.floor(delta / 3_600_000) % 24,
    minutes: Math.floor(delta / 60_000) % 60,
    seconds: Math.floor(delta / 1000) % 60,
    done: false,
  };
}

function Cell({ value, label, size }: { value: number; label: string; size: "md" | "lg" }) {
  return (
    <div
      className={`flex flex-col items-center ${
        size === "lg"
          ? "min-w-[74px] sm:min-w-[120px] md:min-w-[160px]"
          : "min-w-[70px] sm:min-w-[92px]"
      }`}
    >
      <div
        className={`font-bold tabular-nums leading-none ${
          size === "lg"
            ? "text-5xl sm:text-7xl md:text-8xl"
            : "text-4xl sm:text-6xl"
        }`}
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text)",
          textShadow: "0 0 20px rgba(255,6,6,0.5), 0 0 40px rgba(255,6,6,0.25)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        className={`mt-2 uppercase tracking-[0.3em] ${
          size === "lg" ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs"
        }`}
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </div>
    </div>
  );
}

export function Countdown({
  target,
  doneLabel = "THE REVEAL IS HERE",
  size = "md",
}: CountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState<Parts>(() => diff(new Date(target).getTime()));

  useEffect(() => {
    setMounted(true);
    const targetTime = new Date(target).getTime();
    const tick = () => setParts(diff(targetTime));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) {
    return (
      <div className="h-[96px] sm:h-[128px] flex items-center" aria-hidden>
        <span style={{ color: "var(--color-text-muted)" }} className="text-sm">
          The hour approaches...
        </span>
      </div>
    );
  }

  if (parts.done) {
    return (
      <div
        className={`font-bold tracking-widest py-6 ${
          size === "lg" ? "text-4xl sm:text-6xl" : "text-3xl sm:text-5xl"
        }`}
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-accent)",
          textShadow: "0 0 30px rgba(255,6,6,0.6), 0 0 60px rgba(255,6,6,0.3)",
        }}
      >
        {doneLabel}
      </div>
    );
  }

  return (
    <div className={`flex items-start justify-center ${size === "lg" ? "gap-4 sm:gap-10" : "gap-3 sm:gap-6"}`}>
      <Cell value={parts.days} label="Days" size={size} />
      <Cell value={parts.hours} label="Hours" size={size} />
      <Cell value={parts.minutes} label="Minutes" size={size} />
      <Cell value={parts.seconds} label="Seconds" size={size} />
    </div>
  );
}
