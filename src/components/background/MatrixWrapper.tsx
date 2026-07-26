"use client";

import { useEffect, useState } from "react";
import { MatrixBackground } from "./MatrixBackground";

export function MatrixWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <MatrixBackground speed={isMobile ? 0.4 : 1}>
      {children}
    </MatrixBackground>
  );
}
