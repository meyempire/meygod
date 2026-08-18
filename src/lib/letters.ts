import fs from "fs";
import path from "path";

const LETTERS_DIR = path.join(process.cwd(), "revelations", "letters");

/**
 * Parse book + chapter (+ verse) from a scripture filename.
 * "1_14_god_isnt_listening.md" → { book: 1, chapter: 14 }
 * "1_1_14_god_isnt_listening.md" → { book: 1, chapter: 1, verse: 14 }
 */
export function parseScriptureRef(scriptureFilename: string): { book: number; chapter: number; verse?: number } | null {
  if (!scriptureFilename) return null;
  const m = scriptureFilename.match(/^(\d+)_(\d+)(?:_(\d+))?/);
  if (!m) return null;
  return {
    book: parseInt(m[1], 10),
    chapter: parseInt(m[2], 10),
    verse: m[3] ? parseInt(m[3], 10) : undefined,
  };
}

export function getLetterImages(scriptureFilename: string): string[] {
  const ref = parseScriptureRef(scriptureFilename);
  if (!ref) return [];
  if (!fs.existsSync(LETTERS_DIR)) return [];

  const { book, chapter, verse } = ref;
  const prefix = verse !== undefined ? `${book}_${chapter}_${verse}_` : `${book}_${chapter}_`;

  return fs
    .readdirSync(LETTERS_DIR)
    .filter((f) => f.startsWith(prefix) && /\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => {
      // book_chapter(_verse)_page_slug or book_chapter(_verse)_slug
      const pageA = parseInt(a.slice(prefix.length).match(/^(\d+)_/)?.[1] || "0", 10);
      const pageB = parseInt(b.slice(prefix.length).match(/^(\d+)_/)?.[1] || "0", 10);
      return pageA - pageB || a.localeCompare(b);
    });
}
