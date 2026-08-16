"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  target: string; // ISO datetime
  doneLabel?: string;
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

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[70px] sm:min-w-[92px]">
      <div
        className="text-4xl sm:text-6xl font-bold tabular-nums leading-none"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text)",
          textShadow: "0 0 20px rgba(255,6,6,0.5), 0 0 40px rgba(255,6,6,0.25)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div
        className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em]"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </div>
    </div>
  );
}

export function Countdown({ target, doneLabel = "THE REVEAL IS HERE" }: CountdownProps) {
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
        className="text-3xl sm:text-5xl font-bold tracking-widest py-6"
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
    <div className="flex items-start justify-center gap-3 sm:gap-6">
      <Cell value={parts.days} label="Days" />
      <Cell value={parts.hours} label="Hours" />
      <Cell value={parts.minutes} label="Minutes" />
      <Cell value={parts.seconds} label="Seconds" />
    </div>
  );
}
