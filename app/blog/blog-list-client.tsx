"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/blog/post-card";
import { TagFilter } from "@/components/blog/tag-filter";
import type { BlogPost } from "@/lib/blog";

export function BlogListClient({ posts, tags }: { posts: BlogPost[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(
    () => (activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts),
    [posts, activeTag]
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
      <div className="font-mono text-[11px] uppercase tracking-wide text-text-dim">Writing</div>
      <h1 className="mt-3 text-balance font-heading text-4xl font-semibold leading-[1.04] tracking-tight text-text sm:text-5xl">
        Notes from the load-bearing parts
      </h1>
      <p className="mt-4 max-w-[58ch] text-pretty text-[16.5px] leading-relaxed text-text-dim">
        Write-ups of migrations, rewires and production decisions — what broke, what it cost, and
        what I&apos;d do again.
      </p>
      <div className="mt-10">
        <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
      </div>
      <div className="mt-4 flex flex-col">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
