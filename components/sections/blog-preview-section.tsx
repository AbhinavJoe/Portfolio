import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import type { BlogPost } from "@/lib/blog";
import { Reveal } from "@/components/layout/reveal";

export function BlogPreviewSection({ posts }: { posts: BlogPost[] }) {
  const latest = posts.slice(0, 3);

  return (
    <section
      id="blog-preview"
      className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-20 md:grid-cols-[148px_1fr] md:py-28"
    >
      <div
        data-trace-group="blog-preview"
        className="pt-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim"
      >
        04 / Writing
      </div>
      <div>
        <Reveal>
          <div className="flex flex-col">
            {latest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Reveal>
        <Link
          href="/blog"
          className="mt-6 inline-block rounded-md border border-border px-3.5 py-2 font-mono text-[11.5px] uppercase tracking-wide text-text-dim transition-colors hover:border-accent hover:text-accent-strong"
        >
          All posts →
        </Link>
      </div>
    </section>
  );
}
