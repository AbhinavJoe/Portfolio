import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-strong focus-visible:ring-focus-strong",
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
