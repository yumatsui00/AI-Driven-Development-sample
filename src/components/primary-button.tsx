import Link from "next/link";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors";

const variants: Record<NonNullable<PrimaryButtonProps["variant"]>, string> = {
  solid: "bg-white text-ink-900 hover:bg-slate-200 active:bg-slate-300",
  ghost:
    "border border-white/20 text-white hover:border-white/50 hover:bg-white/5 active:bg-white/10"
};

export default function PrimaryButton({
  href,
  children,
  variant = "solid"
}: PrimaryButtonProps) {
  return (
    <Link className={`${baseStyles} ${variants[variant]}`} href={href}>
      {children}
    </Link>
  );
}
