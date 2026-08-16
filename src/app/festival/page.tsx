import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Container from "@/components/ui/Container";
import { FestivalClient } from "./FestivalClient";
import {
  FESTIVAL_DATE,
  FESTIVAL_VENUE,
  FESTIVAL_CITY,
  FESTIVAL_ADDRESS,
  FESTIVAL_TITLE,
  FESTIVAL_TAGLINE,
  FESTIVAL_URL,
  FESTIVAL_DESCRIPTION,
} from "@/lib/festival";

export const metadata: Metadata = {
  title: `${FESTIVAL_TITLE} — ${FESTIVAL_TAGLINE}`,
  description: FESTIVAL_DESCRIPTION,
  alternates: { canonical: FESTIVAL_URL },
  openGraph: {
    title: `${FESTIVAL_TITLE} — ${FESTIVAL_TAGLINE}`,
    description: FESTIVAL_DESCRIPTION,
    url: FESTIVAL_URL,
    type: "website",
  },
};

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${FESTIVAL_TITLE} — ${FESTIVAL_TAGLINE}`,
  description: FESTIVAL_DESCRIPTION,
  startDate: FESTIVAL_DATE,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: FESTIVAL_VENUE,
    address: {
      "@type": "PostalAddress",
      streetAddress: FESTIVAL_ADDRESS,
      addressLocality: FESTIVAL_CITY,
      addressCountry: "ZA",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "MeyGOD",
    url: FESTIVAL_URL,
  },
  url: FESTIVAL_URL,
  image: `${FESTIVAL_URL}/opengraph-image`,
};

export default function FestivalPage() {
  const mapExists = fs.existsSync(
    path.join(process.cwd(), "public", "maps", "velodrome.png")
  );

  return (
    <Container>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <FestivalClient mapExists={mapExists} />
    </Container>
  );
}
