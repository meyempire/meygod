"use client";

import { useState, useCallback } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
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

  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-2 text-xs text-text-muted hover:text-accent transition-colors font-mono"
    >
      <span>{short}</span>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-400" />
      ) : (
        <Copy className="w-3.5 h-3.5 group-hover:text-accent transition-colors" />
      )}
    </button>
  );
}

export default function TheCoin() {
  if (!TOKEN_MINT) return null;

  const jupiterUrl = `https://jup.ag/swap/SOL-${TOKEN_MINT}`;
  const dexScreenerUrl = `https://dexscreener.com/solana/${TOKEN_MINT}`;

  return (
    <section
      className="mb-16 rounded-2xl p-6 sm:p-8"
      style={{
        background: "linear-gradient(180deg, #1a0e0e, #130808)",
        border: "1px solid #2a1515",
        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5)",
      }}
    >
      <h2 className="text-xl font-heading uppercase tracking-widest text-center text-text mb-1"
        style={{ textShadow: "0 0 20px rgba(255,6,6,0.4), 0 0 40px rgba(255,6,6,0.15)" }}>
        The Coin of Revelations
      </h2>

      <p className="text-center text-xs text-text-muted mb-6 font-mono">
        ${TOKEN_TICKER} on Solana
      </p>

      {/* CA */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <span className="text-[10px] uppercase tracking-widest text-text-muted/60">Contract Address</span>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            background: "rgba(255,6,6,0.06)",
            border: "1px solid rgba(255,6,6,0.15)",
          }}
        >
          <CopyAddress address={TOKEN_MINT} />
        </div>
      </div>

      {/* Buy */}
      <div className="flex justify-center mb-6">
        <StoneButton href={jupiterUrl}>
          Buy ${TOKEN_TICKER} on Jupiter
        </StoneButton>
      </div>

      {/* Links */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <a
          href={dexScreenerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted hover:text-accent transition-colors flex items-center gap-1"
        >
          DexScreener <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted hover:text-accent transition-colors flex items-center gap-1"
        >
          Telegram <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-text-muted/40 text-center leading-relaxed max-w-md mx-auto">
        This is a meme. This is a joke. Jesus launched a coin. Pandemonium ensues.
        ${TOKEN_TICKER} has zero utility, zero roadmap, zero expectation of profit.
        It may go to zero. Do not invest money you cannot afford to lose.
      </p>
    </section>
  );
}
