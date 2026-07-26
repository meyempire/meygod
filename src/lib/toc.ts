export interface TocEntry {
  id: string;
  text: string;
  depth: number;
}

export function extractHeadings(code: string): TocEntry[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(code)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    entries.push({ id, text, depth });
  }

  return entries;
}
