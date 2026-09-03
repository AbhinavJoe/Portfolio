import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border bg-surface/30 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <span className="font-mono text-xs text-faint">
          {post.date} · {post.readingTime}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Link>
  );
}
