import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

const COMMENTS_TABLE = "meygod_comments";
const SUBSCRIBERS_TABLE = "meygod_subscribers";

export interface Comment {
  id: number;
  page_slug: string;
  author_name: string;
  content: string;
  created_at: string;
}

export async function getComments(pageSlug: string): Promise<Comment[]> {
  const { data } = await supabase
    .from(COMMENTS_TABLE)
    .select("*")
    .eq("page_slug", pageSlug)
    .order("created_at", { ascending: false });
  return (data as Comment[]) || [];
}

export async function addComment(
  pageSlug: string,
  authorName: string,
  content: string
) {
  return supabase.from(COMMENTS_TABLE).insert({ page_slug: pageSlug, author_name: authorName, content });
}

export function subscribeComments(pageSlug: string, onUpdate: (comments: Comment[]) => void) {
  const channel = supabase
    .channel(`comments-${pageSlug}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: COMMENTS_TABLE, filter: `page_slug=eq.${pageSlug}` },
      () => { getComments(pageSlug).then(onUpdate); }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export async function addSubscriber(email: string) {
  const { error } = await supabase.from(SUBSCRIBERS_TABLE).insert({ email });
  return { error };
}
