"use client";

import { cn } from "@/lib/cn";

export function TagFilter({
  tags,
  activeTag,
  onSelect,
}: {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={activeTag === null}
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full border px-3 py-1 font-mono text-xs",
          activeTag === null ? "border-accent text-accent-strong" : "border-border text-text-dim"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          aria-pressed={activeTag === tag}
          onClick={() => onSelect(tag)}
          className={cn(
            "rounded-full border px-3 py-1 font-mono text-xs",
            activeTag === tag ? "border-accent text-accent-strong" : "border-border text-text-dim"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
