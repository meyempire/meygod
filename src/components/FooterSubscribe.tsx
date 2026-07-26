"use client";

import { useState } from "react";
import { addSubscriber } from "@/lib/supabase/client";
import { StoneButton } from "@/components/ui/stone-button";

export default function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes("@")) return;
    setStatus("submitting");
    const { error } = await addSubscriber(email.trim());
    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setEmail("");
    }
  };

  if (status === "success") {
    return (
      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
          border: "2px solid #2a1515",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
        }}
      >
        <p className="text-xs text-accent font-medium tracking-wider">You have been enlisted.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
        border: "2px solid #2a1515",
        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
      }}
    >
      <h4 className="text-sm font-bold text-text mb-1">Receive the Revelations</h4>
      <p className="text-[10px] text-text-muted mb-3">New scripture delivered. No spam. Unsubscribe anytime.</p>
      <div className="flex items-center gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-surface border border-line/20 text-text text-xs placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
        <StoneButton
          onClick={handleSubmit}
          disabled={status === "submitting" || !email.trim()}
          className="!px-3 !py-1.5 !text-[10px]"
        >
          {status === "submitting" ? "..." : "Subscribe"}
        </StoneButton>
      </div>
      {status === "error" && (
        <p className="text-[10px] text-accent mt-2">Could not enlist. Try again.</p>
      )}
    </div>
  );
}
