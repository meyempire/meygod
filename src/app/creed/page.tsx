import Container from "@/components/ui/Container";
import { getPost } from "@/lib/posts";
import { CreedClient } from "./CreedClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creed",
  description: "The Creed of MeyGOD. Five tenets for those who would become.",
};

export default function CreedPage() {
  const creedPost = getPost("creed-of-enlightenment");

  return (
    <Container>
      <CreedClient creedPostCode={creedPost?.code} />
    </Container>
  );
}
