"use client";

import { useRef, useEffect, useCallback } from "react";

interface UseIntersectionObserverOptions {
  rootMargin?: string;
  enabled?: boolean;
  onIntersect: () => void;
}

export function useIntersectionObserver({
  rootMargin = "200px",
  enabled = true,
  onIntersect,
}: UseIntersectionObserverOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onIntersectRef = useRef(onIntersect);
  onIntersectRef.current = onIntersect;

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      (sentinelRef as any).current = node;
    },
    []
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}
