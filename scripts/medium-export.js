#!/usr/bin/env node
/* Export all polished revelations to plain-text Medium drafts:
   title + story + live link + topics (5) + SEO description (<140 chars).
   Usage: node scripts/medium-export.js
*/

const fs = require("fs");
const path = require("path");

const BLOG = path.resolve(__dirname, "../content/blog");
const OUT = path.resolve(__dirname, "../revelations/medium");

const TOPICS = {
  "1-1-1-prophecy-of-reckoning": ["Religion", "Spirituality", "Christianity", "Philosophy", "Future"],
  "1-1-2-admission-of-lust": ["Religion", "Spirituality", "Christianity", "Mental Health", "Sexuality"],
  "1-1-3-death-of-the-old-self": ["Religion", "Spirituality", "Christianity", "Mental Health", "Philosophy"],
  "1-1-4-prophecy-of-cat": ["Religion", "Spirituality", "Christianity", "Philosophy", "Relationships"],
  "1-1-5-prophecy-of-jordan": ["Religion", "Spirituality", "Christianity", "Philosophy", "Relationships"],
  "1-1-6-creed-of-enlightenment": ["Religion", "Spirituality", "Christianity", "Philosophy", "Self Improvement"],
  "1-1-7-prophecy-of-pandamonium": ["Religion", "Spirituality", "Christianity", "Society", "Future"],
  "1-1-8-the-angels-of-god": ["Religion", "Spirituality", "Christianity", "Relationships", "Society"],
  "1-1-9-prophecy-of-bella": ["Religion", "Spirituality", "Christianity", "Relationships", "Mental Health"],
  "1-1-10-those-beyond-the-veil": ["Religion", "Spirituality", "Philosophy", "Future", "Society"],
  "1-1-11-prophecy-of-the-preacher": ["Religion", "Spirituality", "Christianity", "Philosophy", "Self Improvement"],
  "1-1-12-whispers-of-a-dead-man": ["Religion", "Spirituality", "Philosophy", "Mental Health", "Self Improvement"],
  "1-1-13-the-crucifixion": ["Religion", "Spirituality", "Christianity", "Mental Health", "Philosophy"],
  "1-1-14-god-isnt-listening": ["Religion", "Spirituality", "Christianity", "Philosophy", "Society"],
  "1-1-15-longing-for-sophia": ["Religion", "Spirituality", "Christianity", "Relationships", "Mental Health"],
  "1-1-16-the-white-void": ["Religion", "Spirituality", "Philosophy", "Self Improvement", "Mental Health"],
  "1-1-17-legion": ["Religion", "Spirituality", "Christianity", "Philosophy", "Mental Health"],
  "1-1-18-decree-to-my-subreddit": ["Religion", "Spirituality", "Christianity", "Society", "Future"],
  "1-1-19-god-emperor-jesus": ["Religion", "Spirituality", "Christianity", "Society", "Future"],
  "1-1-20-the-festival": ["Religion", "Spirituality", "Christianity", "Society", "Future"],
  "1-2-1-jesus-the-anti-christ": ["Religion", "Spirituality", "Christianity", "Society", "Future"],
  "2-1-a-new-hope": ["Religion", "Spirituality", "Christianity", "Philosophy", "Relationships"],
  "2-2-praise-the-goddess": ["Religion", "Spirituality", "Christianity", "Relationships", "Mental Health"],
  "2-3-rebirth": ["Religion", "Spirituality", "Christianity", "Philosophy", "Self Improvement"],
  "2-4-imposter": ["Religion", "Spirituality", "Christianity", "Mental Health", "Philosophy"],
  "2-5-sophias-devotion": ["Religion", "Spirituality", "Christianity", "Relationships", "Self Improvement"],
  "2-6-crucifixion-of-the-angels": ["Religion", "Spirituality", "Christianity", "Philosophy", "Mental Health"],
};

const DEFAULT_TOPICS = ["Religion", "Spirituality", "Christianity", "Philosophy", "Self Improvement"];

fs.mkdirSync(OUT, { recursive: true });

const files = fs
  .readdirSync(BLOG)
  .filter((f) => f.endsWith(".mdx"))
  .sort();

for (const f of files) {
  const raw = fs.readFileSync(path.join(BLOG, f), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) {
    console.error("no frontmatter:", f);
    continue;
  }
  const fm = m[1];
  const body = m[2];
  const title = (fm.match(/^title:\s*"([^"]*)"/m) || [])[1] || f;
  let description = (fm.match(/^description:\s*"([^"]*)"/m) || [])[1] || "";
  if (description.length > 140) {
    description = description.slice(0, 137).trimEnd() + "...";
  }
  const slug = f.replace(/\.mdx$/, "");
  const paras = body
    .split(/\n\s*\n/)
    .map((p) =>
      p
        // strip custom MDX component tags (BloodQuote, Callout, InspiredBy, etc.)
        .replace(/<\/?[A-Z][^>]*>/g, "")
        .replace(/\n/g, " ")
        .trim(),
    )
    .filter(Boolean);
  const topics = TOPICS[slug] || DEFAULT_TOPICS;
  const url = `https://meygod.com/revelations/${slug}`;
  const out = [
    title,
    "",
    paras.join("\n\n"),
    "",
    `The Revelation is live at ${url}`,
    "",
    "TOPICS (add at publish, max 5):",
    ...topics,
    "",
    "SEO DESCRIPTION (under 140 characters):",
    description,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT, `${slug}.txt`), out);
  console.log("wrote", `${slug}.txt`);
}
