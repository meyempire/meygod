import { defineConfig, defineCollection, s } from "velite";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

const posts = defineCollection({
  name: "Post",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      title: s.string().min(3).max(120),
      description: s.string().min(10).max(500),
      date: s.isodate(),
      updated: s.isodate().optional(),
      tags: s.array(s.string()).default([]),
      category: s.string().default("Uncategorized"),
      draft: s.boolean().default(false),
      author: s.string().default("MeyGOD"),
      cover: s.image().optional(),
      metadata: s.metadata(),
      excerpt: s.excerpt({ length: 200 }),
      code: s.mdx(),
      raw: s.raw(),
      toc: s.toc(),
      scripture: s.string().optional(),
    })
    .transform((data, { meta }) => ({
      ...data,
      slug: meta.stem || meta.path,
      permalink: `/revelations/${meta.stem || meta.path}`,
      readingTime: data.metadata.readingTime,
      wordCount: data.metadata.wordCount,
    })),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    clean: true,
  },
  collections: { posts },
  mdx: {
    gfm: true,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "rose-pine-moon",
          keepBackground: false,
          defaultLang: "plaintext",
        },
      ],
    ],
  },
});
