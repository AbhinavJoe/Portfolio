import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import type { BlogPost } from "@/lib/blog";
import { Reveal } from "@/components/layout/reveal";
import { SectionHeader } from "@/components/layout/section-header";

export function BlogPreviewSection({ posts }: { posts: BlogPost[] }) {
  const latest = posts.slice(0, 3);

  return (
    <section id="blog-preview" className="mx-auto w-full max-w-content px-6 py-16">
      <SectionHeader index="05" title="Writing" traceGroup="blog-preview" />
      <Reveal>
        <div className="space-y-3">
          {latest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Reveal>
      <Link
        href="/blog"
        className="mt-6 inline-flex items-center gap-1 font-mono text-xs font-medium text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        View all posts →
      </Link>
    </section>
  );
}
