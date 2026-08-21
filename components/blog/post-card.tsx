import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-bg-raised p-6 transition-colors hover:border-accent"
    >
      <span className="font-mono text-xs text-text-dim">
        {post.date} · {post.readingTime}
      </span>
      <h3 className="text-lg font-semibold text-text">{post.title}</h3>
      <p className="text-sm text-text-dim">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Link>
  );
}
