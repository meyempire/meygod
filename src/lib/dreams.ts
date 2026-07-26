import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/server";

interface DreamAnalysis {
  type: string;
  title: string;
  content: string;
}

export interface DreamPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  description: string;
  tags: string[];
  category: string;
  isDream: true;
  scripture: string;
  analyses: DreamAnalysis[];
  mindfullucidityId: number;
  readingTime: number;
  wordCount: number;
}

export interface DreamCard {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  isDream: true;
  readingTime: number;
}

const USER_ID = "0c388678-7d85-4802-9b2b-14c39ed9ee6e";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 225));
}

export const getDreamCards = cache(async (): Promise<DreamCard[]> => {
  const { data: journals } = await supabaseAdmin
    .from("journals")
    .select("journal_id, title, date, description")
    .eq("user_id", USER_ID)
    .order("date", { ascending: false });

  if (!journals) return [];

  const slugCounts = new Map<string, number>();

  return journals.map((j: any) => {
    const baseSlug = `dream-${slugify(j.title)}`;
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);
    const slug = count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;

    return {
      slug,
      title: j.title,
      description: j.description || "",
      date: j.date,
      tags: ["dream"],
      category: "Dreams",
      isDream: true as const,
      readingTime: estimateReadingTime(j.description || ""),
    };
  });
});

export const getDreams = cache(async (): Promise<DreamPost[]> => {
  const { data: journals } = await supabaseAdmin
    .from("journals")
    .select("*")
    .eq("user_id", USER_ID)
    .order("date", { ascending: false });

  const { data: analyses } = await supabaseAdmin
    .from("journal_analyses")
    .select("*")
    .eq("user_id", USER_ID);

  if (!journals) return [];

  const analysesByJournal = new Map<number, DreamAnalysis[]>();
  if (analyses) {
    for (const a of analyses) {
      const list = analysesByJournal.get(a.journal_id) || [];
      list.push({ type: a.type, title: a.title, content: a.content });
      analysesByJournal.set(a.journal_id, list);
    }
  }

  const slugCounts = new Map<string, number>();

  return journals.map((j: any) => {
    const wordCount = j.content?.trim().split(/\s+/).length || 0;
    let baseSlug = `dream-${slugify(j.title)}`;
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);
    const slug = count > 0 ? `${baseSlug}-${count + 1}` : baseSlug;

    return {
      slug,
      title: j.title,
      date: j.date,
      content: j.content || "",
      description: j.description || "",
      tags: ["dream"],
      category: "Dreams",
      isDream: true,
      scripture: j.content || "",
      analyses: analysesByJournal.get(j.journal_id) || [],
      mindfullucidityId: j.journal_id,
      readingTime: estimateReadingTime(j.content || ""),
      wordCount,
    };
  });
});

export const getDream = cache(async (slug: string): Promise<DreamPost | null> => {
  const dreams = await getDreams();
  return dreams.find((d) => d.slug === slug) || null;
});
