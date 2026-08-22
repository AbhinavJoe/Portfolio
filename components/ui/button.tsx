import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Outline-first language throughout — no solid fills except the
      // subtle hover tint, matching the site's restrained editorial style.
      variant: {
        // Tailwind's /opacity modifier can't decompose a CSS-variable color
        // into channels, so the hover tint uses color-mix() directly — same
        // approach the rest of the codebase uses for translucent tokens
        // (e.g. --border's baked-in alpha).
        primary:
          "border border-accent text-accent-strong hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] focus-visible:ring-accent",
        outline:
          "border border-border text-text hover:border-accent hover:text-accent-strong focus-visible:ring-accent",
        ghost: "text-text-dim hover:text-text focus-visible:ring-accent",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
