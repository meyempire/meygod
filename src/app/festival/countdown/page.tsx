import type { Metadata } from "next";
import { CountdownClient } from "./CountdownClient";
import { FESTIVAL_TITLE, FESTIVAL_TAGLINE } from "@/lib/festival";

export const metadata: Metadata = {
  title: `${FESTIVAL_TITLE} — The Vigil`,
  description: `${FESTIVAL_TAGLINE}. The hour approaches.`,
  robots: { index: false, follow: false },
};

export default function CountdownPage() {
  return <CountdownClient />;
}
