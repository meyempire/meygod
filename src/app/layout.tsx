import type { Metadata } from "next";
import {
  Rajdhani,
  Space_Grotesk,
  Space_Mono,
  Chakra_Petch,
  Nosifer,
  Eater,
  Creepster,
  Frijole,
  Rubik_Wet_Paint,
} from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-heading",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-logo",
});

const nosifer = Nosifer({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nosifer",
});

const eater = Eater({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-eater",
});

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-creepster",
});

const frijole = Frijole({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-frijole",
});

const wetPaint = Rubik_Wet_Paint({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-wetpaint",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://meygod.com"),
  title: {
    default: "MeyGOD — A Voice in the Wilderness",
    template: "%s — MeyGOD",
  },
  description: "Calling heroes to rise, overcome, and become. Writings on will, creation, and the upward path.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "MeyGOD — A Voice in the Wilderness",
    description: "Calling heroes to rise, overcome, and become.",
    siteName: "MeyGOD",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@meygod",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed/feed.xml",
      "application/atom+xml": "/feed/atom.xml",
      "application/feed+json": "/feed/feed.json",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${rajdhani.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${chakraPetch.variable} ${nosifer.variable} ${eater.variable} ${creepster.variable} ${frijole.variable} ${wetPaint.variable}`}
    >
      <body className="min-h-screen bg-bg text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
