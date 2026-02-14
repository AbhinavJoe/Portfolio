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
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="mb-4 text-3xl font-bold text-text">Blog</h1>
      <p className="mb-8 max-w-prose text-text-dim">
        Notes from building production systems — auth, task queues, LLM pipelines, and the
        occasional frontend.
      </p>
      <div className="mb-10">
        <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
