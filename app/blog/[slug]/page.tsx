import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, extractHeadings } from "@/lib/blog";
import { createMdxComponents } from "@/components/blog/mdx-components";

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

  const headings = extractHeadings(post.content);
  const mdxComponents = createMdxComponents(headings);

  return (
    <article className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <Link
        href="/blog"
        className="font-mono text-[11.5px] uppercase tracking-wide text-text-dim hover:text-accent-strong"
      >
        ← All posts
      </Link>

      <div className="mt-7 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_210px]">
        <div className="min-w-0">
          <div className="flex items-center gap-3 font-mono text-[11.5px] text-text-dim">
            <span>{post.date}</span>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-3 max-w-[26ch] text-balance font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-text md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-[62ch] text-pretty text-lg leading-relaxed text-text-dim">
            {post.excerpt}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5 border-b border-border pb-7">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-text-dim"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </div>

        {headings.length > 0 && (
          <aside className="sticky top-24 hidden flex-col gap-2.5 border-l border-border pl-5 lg:flex">
            <div className="font-mono text-[10.5px] uppercase tracking-wide text-text-dim">On this page</div>
            {headings.map((heading) => (
              <a
                key={heading.slug}
                href={`#${heading.slug}`}
                className={
                  heading.depth === 3
                    ? "pl-3 text-[13px] leading-snug text-text-dim hover:text-accent-strong"
                    : "text-[13px] leading-snug text-text-dim hover:text-accent-strong"
                }
              >
                {heading.num ? `${heading.num}  ${heading.text}` : heading.text}
              </a>
            ))}
          </aside>
        )}
      </div>
    </article>
  );
}
