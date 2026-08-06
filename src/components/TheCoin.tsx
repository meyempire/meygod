"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import Sigil from "@/components/Sigil";
import { StoneButton } from "@/components/ui/stone-button";

const TOKEN_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT;
const TOKEN_TICKER = process.env.NEXT_PUBLIC_TOKEN_TICKER || "MEYGOD";

function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address]);

  const short = `${address.slice(0, 8)}...${address.slice(-6)}`;

  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-2 text-xs transition-colors"
      style={{
        fontFamily: "var(--font-mono)",
        color: "rgba(255,6,6,0.7)",
        textShadow: "0 0 10px rgba(255,6,6,0.2)",
      }}
    >
      <span>{short}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

export default function TheCoin() {
  if (!TOKEN_MINT) return null;

  const pumpfunUrl = `https://pump.fun/coin/${TOKEN_MINT}`;

  return (
    <section className="mb-16">
      <div
        className="rounded-2xl pt-12 sm:pt-16 px-6 sm:px-10 pb-8 sm:pb-10"
        style={{
          background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
          border: "2px solid #2a1515",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
        }}
      >
        {/* Heading row — matches AltarConfession pattern */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Sigil size={48} />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">
            <span style={{ textTransform: "none" }}>
              <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)", textShadow: "0 0 12px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.1)" }}>Mey</span>
              <span style={{ fontFamily: "var(--font-god)", color: "var(--color-accent)", textShadow: "0 0 12px rgba(255,6,6,0.5), 0 0 30px rgba(255,6,6,0.2)" }}>GOD</span>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--color-text-muted)" }}> Meme Coin</span>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-xs text-text-muted/50 mb-8">
          Jesus launched a coin. Pandemonium ensues. Pure meme. Pure joke.
        </p>

        {/* CA + Copy */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted/40">
            The Sacred Contract
          </span>
          <CopyAddress address={TOKEN_MINT} />
        </div>

        {/* Buy */}
        <div className="flex justify-center mt-8 mb-6">
          <StoneButton href={pumpfunUrl}>
            Trade on Pump.fun
          </StoneButton>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-text-muted/30 text-center leading-relaxed max-w-md mx-auto">
          ${TOKEN_TICKER} has zero utility, zero roadmap, zero expectation of profit.
          It may go to zero. Do not invest money you cannot afford to lose.
        </p>
      </div>
    </section>
  );
}
