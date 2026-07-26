"use client";

import { ShimmerButton } from "@/components/ui/shimmer-button";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex justify-center sm:justify-start items-center gap-3 not-prose flex-wrap">
      <ShimmerButton
        shimmerColor="rgba(255,6,6,0.2)"
        shimmerSize="0.08em"
        background="transparent"
        className="!p-0 !h-auto !text-xs uppercase tracking-widest text-text-muted cursor-default"
        borderRadius="100px"
      >
        Sacrifice Him to the Algorithm
      </ShimmerButton>
      <div className="flex items-center gap-2">
        <a
          href={`https://x.com/intent/post?text=${text}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-accent/10 text-text-muted hover:text-accent-2 border border-line/20 hover:border-accent/30 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-accent/10 text-text-muted hover:text-accent-2 border border-line/20 hover:border-accent/30 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Share
        </a>
        <a
          href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-accent/10 text-text-muted hover:text-accent-2 border border-line/20 hover:border-accent/30 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.56 12.04a1.56 1.56 0 0 1-.993 2.322c.184.872.077 2.032-.601 3.011-.98 1.415-3.04 1.96-6.966 1.96s-5.986-.545-6.966-1.96c-.678-.979-.785-2.14-.601-3.011a1.56 1.56 0 1 1 1.297-2.604c1.304-.932 3.153-1.34 5.27-1.38l1.12-5.224a.155.155 0 0 1 .184-.125l3.656.775a1.05 1.05 0 1 1 .098.446l-3.314.703-.998 4.68c2.072.087 3.865.496 5.132 1.388a1.56 1.56 0 0 1 2.322-.981z"/></svg>
          Reddit
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface hover:bg-accent/10 text-text-muted hover:text-accent-2 border border-line/20 hover:border-accent/30 transition-all"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          Copy
        </button>
      </div>
    </div>
  );
}
