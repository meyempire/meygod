import fs from "fs";
import path from "path";

const LETTERS_DIR = path.join(process.cwd(), "revelations", "letters");

export function getLetterImages(scriptureFilename: string): string[] {
  if (!scriptureFilename) return [];

  const match = scriptureFilename.match(/^(\d+)_/);
  if (!match) return [];

  const num = match[1];
  if (!fs.existsSync(LETTERS_DIR)) return [];

  return fs
    .readdirSync(LETTERS_DIR)
    .filter((f) => {
      const m = f.match(new RegExp(`^${num}(?:_(\\d+))?_`));
      return !!m && /\.(jpe?g|png|webp)$/i.test(f);
    })
    .sort((a, b) => {
      const pageA = parseInt(a.match(new RegExp(`^${num}_(\\d+)_`))?.[1] || "0", 10);
      const pageB = parseInt(b.match(new RegExp(`^${num}_(\\d+)_`))?.[1] || "0", 10);
      return pageA - pageB || a.localeCompare(b);
    });
}
