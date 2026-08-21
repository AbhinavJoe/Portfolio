import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Next.js 15: route `params` is a Promise in Server Components — must be awaited.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — Abhinav Joshi`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="mb-8 inline-block text-sm text-accent-strong">
        ← Back to blog
      </Link>
      <span className="font-mono text-xs text-text-dim">
        {post.date} · {post.readingTime} · {post.company}
      </span>
      <h1 className="mt-2 mb-8 text-3xl font-bold text-text md:text-4xl">{post.title}</h1>
      <div className="prose-invert">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
