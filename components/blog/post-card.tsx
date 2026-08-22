import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="grid grid-cols-1 gap-2 border-t border-border py-5 transition-colors first:border-t-0 hover:border-accent sm:grid-cols-[118px_1fr] sm:gap-6 sm:py-5"
    >
      <span className="font-mono text-[11.5px] leading-relaxed text-text-dim">
        {post.date}
        <br className="hidden sm:block" /> {post.readingTime}
      </span>
      <div>
        <h3 className="font-heading text-lg font-semibold tracking-tight text-text">{post.title}</h3>
        <p className="mt-1.5 max-w-[74ch] text-sm leading-relaxed text-text-dim">{post.excerpt}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
