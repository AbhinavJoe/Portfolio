import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  company: string;
  role: string;
  excerpt: string;
  readingTime: string;
  content: string;
};

function loadPost(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    tags: data.tags ?? [],
    company: data.company,
    role: data.role,
    excerpt: data.excerpt,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map(loadPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

export function getAllTags(): string[] {
  const tags = getAllPosts().flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}

export type Heading = {
  depth: 2 | 3;
  /** Plain text, inline markdown emphasis/code markers stripped — matches
   * what the rendered heading's text content looks like, so mdx-components
   * can key off the same string. */
  text: string;
  slug: string;
  /** Sequential "01", "02"... for h2s only; h3s nest under their h2 and
   * don't get their own top-level number. */
  num?: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Pulls h2/h3 headings out of raw MDX source via a line-level regex, ahead
 * of MDX rendering — good enough for this content (plain-text headings, no
 * links or line breaks inside them) and lets the post page build a table of
 * contents and per-heading numbering without a full markdown AST pass.
 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const slugCounts = new Map<string, number>();
  let h2Count = 0;

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    // Strip inline emphasis/code markers so this matches the plain text
    // MDX actually renders (e.g. "**without**" -> "without").
    const text = match[2].replace(/[*_`]/g, "");

    let slug = slugify(text);
    const count = slugCounts.get(slug) ?? 0;
    slugCounts.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;

    if (depth === 2) h2Count += 1;
    headings.push({ depth, text, slug, num: depth === 2 ? String(h2Count).padStart(2, "0") : undefined });
  }

  return headings;
}
