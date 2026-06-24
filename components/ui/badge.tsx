import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border bg-bg/40 px-2 py-0.5 font-mono text-[10px] text-muted transition-colors hover:border-accent/30 hover:text-fg",
        className
      )}
      {...props}
    />
  );
}
