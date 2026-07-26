"use client";

import { useEffect, useState, useCallback } from "react";
import { getComments, addComment, subscribeComments, type Comment } from "@/lib/supabase/client";
import { StoneButton } from "@/components/ui/stone-button";
import Sigil from "@/components/Sigil";

interface Props {
  pageSlug: string;
  limit?: number;
  inputOnTop?: boolean;
  hideTitle?: boolean;
}

export function ConfessionSection({ pageSlug, limit, inputOnTop = true, hideTitle = false }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [confession, setConfession] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getComments(pageSlug).then(setComments);
    const unsub = subscribeComments(pageSlug, setComments);
    return unsub;
  }, [pageSlug]);

  const handleSubmit = useCallback(async () => {
    if (!confession.trim()) return;
    setStatus("submitting");
    setError(null);
    try {
      const result = await addComment(pageSlug, name.trim() || "Anonymous", confession.trim());
      if (result.error) {
        setError(result.error.message || "Failed to submit confession.");
        setStatus("idle");
        return;
      }
      setConfession("");
      setStatus("sent");
    } catch {
      setError("Could not reach the altar. Try again.");
      setStatus("idle");
    }
  }, [confession, name, pageSlug]);

  const displayed = limit ? comments.slice(0, limit) : comments;

  const formBlock = (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Your name (or leave blank)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-black/30 border border-line/20 text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors text-sm"
      />
      <textarea
        placeholder="Speak your confession..."
        value={confession}
        onChange={(e) => { setConfession(e.target.value); if (status === "sent") setStatus("idle"); }}
        rows={3}
        className="w-full px-4 py-2 rounded-lg bg-black/30 border border-line/20 text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors text-sm resize-none"
      />
      <div className="flex justify-end">
        <StoneButton
          onClick={handleSubmit}
          disabled={status === "submitting" || !confession.trim()}
          className="!px-6 !py-2 !text-xs"
        >
          {status === "submitting" ? "Submitting..." : status === "sent" ? "Confessed. Speak more." : "Confess"}
        </StoneButton>
      </div>
      {error && (
        <p className="text-xs text-accent">{error}</p>
      )}
    </div>
  );

  const messagesBlock = (
    <div className="space-y-4">
      {displayed.length === 0 ? (
        <p className="text-center text-text-muted text-xs py-6">
          No confessions yet. Be the first to speak.
        </p>
      ) : (
        displayed.map((c) => (
          <div key={c.id} className="p-4 rounded-lg bg-black/30 border border-line/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-accent-2">{c.author_name}</span>
              <span className="text-[10px] text-text-muted">
                {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{c.content}</p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <section className="not-prose">
      {!hideTitle && <h3 className="text-lg font-bold text-text mb-6">Confession</h3>}
      {inputOnTop ? (
        <>
          <div className="mb-6">{formBlock}</div>
          {messagesBlock}
        </>
      ) : (
        <>
          {messagesBlock}
          <div className={displayed.length > 0 ? "mt-6" : "mt-6"}>{formBlock}</div>
        </>
      )}
    </section>
  );
}

export function AltarConfession() {
  return (
    <section className="mb-16">
      <div
        className="rounded-2xl pt-12 sm:pt-16 px-6 sm:px-10 pb-6 sm:pb-10"
        style={{
          background: "linear-gradient(180deg, #1a0e0e 0%, #130808 100%)",
          border: "2px solid #2a1515",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,6,6,0.08)",
        }}
      >
        <div className="flex items-center justify-center gap-4 mb-10">
          <Sigil size={48} />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">
            <span style={{ textTransform: "none" }}>
              <span style={{ fontFamily: "var(--font-logo)", fontWeight: 700, color: "var(--color-text)", textShadow: "0 0 12px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.1)" }}>Mey</span>
              <span style={{ fontFamily: "var(--font-god)", color: "var(--color-accent)", textShadow: "0 0 12px rgba(255,6,6,0.5), 0 0 30px rgba(255,6,6,0.2)" }}>GOD</span>
              <span style={{ fontFamily: "var(--font-body)", fontWeight: 300, color: "var(--color-text-muted)" }}> Confessions</span>
            </span>
          </h1>
        </div>
        <ConfessionSection pageSlug="altar" limit={5} inputOnTop={false} hideTitle />
      </div>
    </section>
  );
}
