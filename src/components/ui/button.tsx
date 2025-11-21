import * as React from "react";
import { cva, type VariantProps } from "@/utils/cva";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 text-white shadow-lg shadow-ink-300/50 hover:from-ink-800 hover:to-ink-900 focus-visible:ring-ink-900 focus-visible:ring-offset-ink-50",
        ghost:
          "border border-ink-200 bg-white text-ink-900 shadow-sm hover:border-ink-300 hover:bg-ink-50 focus-visible:ring-ink-900 focus-visible:ring-offset-ink-50"
      },
      size: {
        default: "h-12 px-6 text-base",
        sm: "h-10 px-5 text-sm",
        lg: "h-14 px-8 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

/**
 * Shadcn-style button wrapper used across the landing page UI.
 */
export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };
