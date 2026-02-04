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
