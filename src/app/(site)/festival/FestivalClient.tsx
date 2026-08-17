"use client";

import { useState } from "react";
import Link from "next/link";
import BrandName from "@/components/BrandName";
import Sigil from "@/components/Sigil";
import { ShareButtons } from "@/components/ShareButtons";
import { Countdown } from "@/components/festival/Countdown";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { GlowCard } from "@/components/ui/glow-card";
import { StoneButton } from "@/components/ui/stone-button";
import { addFestivalRsvp } from "@/lib/supabase/client";
import {
  FESTIVAL_DATE,
  FESTIVAL_DAY_LABEL,
  FESTIVAL_TIME_LABEL,
  FESTIVAL_VENUE,
  FESTIVAL_CITY,
  FESTIVAL_TAGLINE,
  FESTIVAL_URL,
  FESTIVAL_MAPS_URL,
} from "@/lib/festival";

const CAST = [
  {
    name: "The King",
    role: "Opens the Gates",
    line: "A king who turned God away, and paid for it. Now, redeemed by labor, he opens the stage — first to kneel, first to rise.",
  },
  {
    name: "The Preacher",
    role: "The Witness",
    line: "Found ranting in a park on a Monday morning. Shown God. Now he walks the week at His side, waking the sleepers — and on the day, he tells you everything he saw.",
  },
  {
    name: "Sophia",
    role: "The Divine Light",
    line: "Beyond the veil she waits — wisdom itself, the light that leads. Jesus' other half. On the day she calls His name, and the sleeping God rises.",
  },
  {
    name: "Jesus",
    role: "Takes the Stage",
    line: "God incarnate, in the flesh you see before you. He does not perform — He reveals. When the crowd is stirred, He preaches the Pandamonium of Revelations and the rebirth of humanity.",
  },
];

const PANEL_STYLE = {
  background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
  border: "2px solid #2a1515",
  boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
};

function Divider() {
  return (
    <div
      className="my-12 h-px mx-auto max-w-2xl"
      style={{
        background:
          "linear-gradient(90deg, transparent, rgba(255,6,6,0.35), rgba(255,57,57,0.45), transparent)",
      }}
    />
  );
}

function InlineBrand() {
  return (
    <span style={{ textTransform: "none" }}>
      <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)" }}>Mey</span>
      <span
        style={{
          fontFamily: "var(--font-god)",
          color: "var(--color-accent)",
          textShadow: "0 0 10px rgba(255,6,6,0.45), 0 0 24px rgba(255,6,6,0.18)",
        }}
      >
        GOD
      </span>
    </span>
  );
}

export function FestivalClient({ mapExists = false }: { mapExists?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "seen">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleRsvp = async () => {
    if (!email.trim()) return;
    setStatus("submitting");
    setError(null);
    try {
      const result = await addFestivalRsvp(name.trim(), email.trim());
      if (result.error) {
        setError(result.error.message || "The altar refused your name. Try again.");
        setStatus("idle");
        return;
      }
      setStatus("seen");
    } catch {
      setError("Could not reach the altar. Try again.");
      setStatus("idle");
    }
  };

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <div className="section--hero">
        <Link
          href="/festival/countdown"
          className="flex flex-col items-center"
          aria-label="Open the fullscreen countdown"
        >
          <div className="mb-16 sm:mb-24 sm:hidden">
            <Sigil size={110} />
          </div>
          <div className="mb-16 sm:mb-24 hidden sm:block">
            <Sigil size={200} />
          </div>
          <div className="mb-6">
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
            className="relative z-10 -mt-3 text-2xl sm:-mt-4 sm:text-4xl"
            style={{
              fontFamily: "var(--font-god)",
              color: "var(--color-accent)",
              textShadow: "0 0 20px rgba(255,6,6,0.5), 0 0 40px rgba(255,6,6,0.25)",
            }}
          >
            FESTIVAL
          </h1>
          <p className="mb-2 pt-6 text-text text-sm sm:text-base uppercase tracking-[0.35em] text-center">
            {FESTIVAL_TAGLINE}
          </p>
          <p className="mb-6 text-text-muted text-sm text-center">
            {FESTIVAL_DAY_LABEL}
          </p>
          <div className="mb-8">
            <Countdown target={FESTIVAL_DATE} />
          </div>
        </Link>
        <div className="mb-10">
          <ShareButtons
            title={`MeyGOD Festival — ${FESTIVAL_TAGLINE}. Sunday 30 August. All are welcome. None are exempt.`}
            url={FESTIVAL_URL}
          />
        </div>
      </div>

      {/* ---------- The Stone Tablet ---------- */}
      <section className="mb-16">
        <div
          className="rounded-2xl pt-12 sm:pt-16 px-8 sm:px-16 pb-10 sm:pb-14"
          style={PANEL_STYLE}
        >
          {/* Where and When */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-8 sm:gap-12 items-center">
              <div className="flex flex-col items-start gap-3 justify-self-start">
                {mapExists ? (
                  <a
                    href={FESTIVAL_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full group"
                  >
                    <div
                      className="w-full aspect-[2/1] overflow-hidden rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{
                        border: "2px solid #2a1515",
                        boxShadow: "0 0 40px rgba(255,6,6,0.12)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/maps/velodrome.png"
                        alt={`Map of ${FESTIVAL_VENUE}, ${FESTIVAL_CITY}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </a>
                ) : (
                  <div
                    className="w-full aspect-[2/1] rounded-xl flex items-center justify-center"
                    style={{
                      border: "2px solid #2a1515",
                      background: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <Sigil size={64} />
                  </div>
                )}
              </div>
              <div
                className="text-center sm:text-right sm:border-l sm:border-dashed sm:pl-12 justify-self-end w-full"
                style={{ borderColor: "#2a1515" }}
              >
                <h2
                  className="section-title"
                  style={{ fontSize: "1.875rem", letterSpacing: "0.08em" }}
                >
                  Where and When
                </h2>
                <div
                  className="mt-4 text-sm sm:text-base tracking-[0.2em]"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-accent)",
                    textShadow: "0 0 16px rgba(255,6,6,0.4)",
                  }}
                >
                  {FESTIVAL_DAY_LABEL.toUpperCase()}
                </div>
                <div className="mt-1 text-base sm:text-lg text-text font-medium">
                  <a
                    href={FESTIVAL_MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {FESTIVAL_VENUE}
                  </a>
                </div>
                <div className="text-sm text-text-muted">{FESTIVAL_CITY}</div>
                <div className="mt-4 text-[10px] uppercase tracking-[0.35em] text-text-muted">
                  The Hour
                </div>
                <div
                  className="mt-0.5 text-4xl sm:text-5xl font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "var(--color-text)",
                    textShadow:
                      "0 0 20px rgba(255,6,6,0.6), 0 0 50px rgba(255,6,6,0.3)",
                  }}
                >
                  {FESTIVAL_TIME_LABEL}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-text-muted italic leading-relaxed">
                  All are welcome. None are exempt. Come as you are — leave as who
                  you must become.
                </p>
              </div>
            </div>
          </div>

          <Divider />

          {/* The Cast */}
          <div>
            <h2 className="section-title text-center">The Cast</h2>
            <p className="section-subtitle">
              Who do you want to be in the Bible? The festival is where you find out.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {CAST.map((member) => (
                <GlowCard
                  key={member.name}
                  gradientColor="#ff0606"
                  gradientOpacity={0.3}
                  gradientFrom="#ff0606"
                  gradientTo="#ff3939"
                  className="p-6 rounded-xl"
                >
                  <h3
                    className="text-xl font-bold text-text mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {member.name}
                  </h3>
                  <div
                    className="text-[10px] uppercase tracking-[0.3em] mb-3"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {member.role}
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{member.line}</p>
                </GlowCard>
              ))}
            </div>
          </div>

          <Divider />

          {/* What is MeyGOD */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-8 sm:gap-12 items-center">
              <div className="text-center sm:text-left justify-self-start w-full">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  What is <InlineBrand />?
                </h2>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  Jesus is here. This is his religion. <InlineBrand /> is the faith
                  of heroes — a summons to wake up from the dream, let the old self
                  die, and be reborn as what you must become. Pandemonium of
                  Revelations has begun, the religion is live at{" "}
                  <span className="text-text font-medium">meygod.com</span>. The
                  Festival is my coming. Your first labor is to bear witness.{" "}
                  <span
                    className="font-semibold"
                    style={{
                      color: "var(--color-accent)",
                      textShadow:
                        "0 0 12px rgba(255,255,255,0.55), 0 0 30px rgba(255,255,255,0.2)",
                    }}
                  >
                    Wake up!
                  </span>
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
                  <StoneButton href="/creed">Read the Creed</StoneButton>
                  <StoneButton href="/revelations/1-1-prophecy-of-reckoning">
                    Begin the Revelations
                  </StoneButton>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end w-full">
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/qr-festival.png"
                    alt="QR code — meygod.com/festival"
                    className="w-52 sm:w-64 rounded-xl"
                  />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted">
                    Pierce the veil
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The Bear Witness Tablet ---------- */}
      <section className="mb-16">
        <div
          className="rounded-2xl pt-12 sm:pt-16 px-8 sm:px-16 pb-10 sm:pb-14"
          style={PANEL_STYLE}
        >

          {/* Bear Witness */}
          <div className="max-w-xl mx-auto">
            <h2 className="section-title text-center">Bear Witness</h2>
            <p className="text-sm text-text-muted text-center mt-6 leading-relaxed">
              Write your name in the book of those who will witness the Coming.
            </p>
            <div className="text-center mt-6 mb-8 max-w-lg mx-auto">
              <p
                className="text-text leading-relaxed italic text-sm"
                style={{
                  fontFamily: "var(--font-heading)",
                  textShadow: "0 0 16px rgba(255,6,6,0.25)",
                }}
              >
                &ldquo;The way to it is long and may even take lifetimes, but how
                to find your way is simple, Wake Up!&rdquo;
              </p>
              <div className="mt-3">
                <Link
                  href="/revelations/1-16-the-white-void"
                  className="text-text-muted hover:text-accent transition-colors text-xs"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  — The White Void 1:16
                </Link>
              </div>
            </div>
            {status === "seen" ? (
              <p
                className="text-center text-lg font-bold py-8"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-accent)",
                  textShadow: "0 0 20px rgba(255,6,6,0.5)",
                }}
              >
                Your name is written. Sunday, you rise.
              </p>
            ) : (
              <div>
                <div
                  className="flex flex-col sm:flex-row overflow-hidden rounded-xl bg-black/30"
                  style={{ border: "2px solid #2a1515" }}
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-5 py-3 bg-transparent text-text placeholder:text-text-muted/60 focus:outline-none focus:bg-accent/5 transition-colors text-sm sm:border-r"
                    style={{ borderColor: "#2a1515" }}
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-5 py-3 bg-transparent text-text placeholder:text-text-muted/60 focus:outline-none focus:bg-accent/5 transition-colors text-sm"
                  />
                </div>
                <div className="flex justify-center mt-6">
                  <StoneButton
                    onClick={handleRsvp}
                    disabled={status === "submitting" || !email.trim()}
                  >
                    {status === "submitting" ? "Writing your name..." : "I will bear witness"}
                  </StoneButton>
                </div>
                {error && <p className="text-xs text-accent text-center mt-3">{error}</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
