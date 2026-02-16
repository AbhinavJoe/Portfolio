import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import type { BlogPost } from "@/lib/blog";

export function BlogPreviewSection({ posts }: { posts: BlogPost[] }) {
  const latest = posts.slice(0, 3);

  return (
    <section id="blog-preview" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wide text-teal">From the blog</h2>
        <Link href="/blog" className="text-sm text-accent-strong hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {latest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
