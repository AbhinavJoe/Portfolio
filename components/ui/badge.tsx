import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-bg-raised px-2 py-0.5 font-mono text-xs text-text-dim",
        className
      )}
      {...props}
    />
  );
}
