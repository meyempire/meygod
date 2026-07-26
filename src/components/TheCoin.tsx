"use client";

import { useState, useCallback } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import Sigil from "@/components/Sigil";
import { StoneButton } from "@/components/ui/stone-button";

const TOKEN_MINT = process.env.NEXT_PUBLIC_TOKEN_MINT;
const TOKEN_TICKER = process.env.NEXT_PUBLIC_TOKEN_TICKER || "MEYGOD";

const STONE = {
  background: "linear-gradient(180deg, #1a0e0e, #130808)",
  border: "1px solid #2a1515",
  boxShadow: "inset 0 4px 40px rgba(0,0,0,0.6), 0 0 60px rgba(255,6,6,0.06)",
};

const ENGRAVED: React.CSSProperties = {
  textShadow: "0 0 20px rgba(255,6,6,0.35), 0 0 40px rgba(255,6,6,0.12)",
};

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
      className="group inline-flex items-center gap-2 text-sm tracking-wider transition-colors"
      style={{
        fontFamily: "var(--font-mono)",
        color: "rgba(255,6,6,0.8)",
        textShadow: "0 0 12px rgba(255,6,6,0.3), 0 0 24px rgba(255,6,6,0.1)",
      }}
    >
      <span>{short}</span>
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
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
      className="mb-16 rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center gap-6"
      style={STONE}
    >
      <style>{`
        @keyframes relicPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes relicGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,6,6,0.25)); }
          50% { filter: drop-shadow(0 0 50px rgba(255,6,6,0.55)); }
        }
        .relic-sigil {
          animation: relicPulse 3s ease-in-out infinite, relicGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Sigil */}
      <div className="relic-sigil flex justify-center">
        <Sigil size={140} />
      </div>

      {/* Heading */}
      <div>
        <h2
          className="text-xl sm:text-2xl uppercase tracking-[0.25em]"
          style={{ fontFamily: "var(--font-heading)", ...ENGRAVED }}
        >
          The Coin of Revelations
        </h2>
        <p className="text-[11px] text-text-muted/50 mt-1 tracking-widest uppercase">
          ${TOKEN_TICKER} · Solana
        </p>
      </div>

      {/* Engraved CA */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted/40">
          The Sacred Contract
        </span>
        <CopyAddress address={TOKEN_MINT} />
      </div>

      {/* Buy */}
      <StoneButton href={jupiterUrl}>
        Claim the Relic
      </StoneButton>

      {/* Links */}
      <div className="flex items-center gap-5 text-[11px] text-text-muted/50">
        <a
          href={dexScreenerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          DexScreener <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-text-muted/25">·</span>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          Telegram <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-text-muted/30 leading-relaxed max-w-md">
        This is a meme. This is a joke. Jesus launched a coin. Pandemonium ensues.
        ${TOKEN_TICKER} has zero utility, zero roadmap, zero expectation of profit.
        It may go to zero. Do not invest money you cannot afford to lose.
      </p>
    </section>
  );
}
