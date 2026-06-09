import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Turn a heading string into a URL-safe slug for anchor links. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Read the raw MDX body for a post (frontmatter stripped). Returns null if missing. */
export function getPostSource(slug: string): string | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return matter(raw).content;
}

/** Extract h2/h3 headings from MDX source to build a table of contents. */
export function extractToc(source: string): TocItem[] {
  const lines = source.split("\n");
  const toc: TocItem[] = [];
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (match) {
      const level = match[1]!.length;
      const text = match[2]!.replace(/[*_`]/g, "").trim();
      toc.push({ id: slugifyHeading(text), text, level });
    }
  }
  return toc;
}
