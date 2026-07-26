"use client";

import { useEffect, useRef } from "react";

export default function Giscus() {
  const ref = useRef<HTMLDivElement>(null);
  const theme = "dark_dimmed";

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "[YOUR_USERNAME]/[YOUR_REPO]");
    script.setAttribute("data-repo-id", "[YOUR_REPO_ID]");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "[YOUR_CATEGORY_ID]");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "en");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return (
    <section className="mt-16 pt-8 border-t border-line/10">
      <div ref={ref} />
    </section>
  );
}
