"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { LandingHeroProps } from "@/types/landing";
import { getSession } from "@/utils/session";

/**
 * Hero section with headline, description, and CTA.
 */
export default function LandingHero({ translation }: LandingHeroProps) {
  const router = useRouter();

  const handleStart = () => {
    const session = getSession();
    if (session?.login) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-8 py-12 text-center">
      <p className="rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-600 shadow-sm">
        {translation.appName}
      </p>
      <h1 className="bg-gradient-to-r from-ink-900 via-ink-800 to-ink-900 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl">
        {translation.tagline}
      </h1>
      <p className="max-w-2xl text-base text-ink-700 sm:text-lg">
        {translation.description}
      </p>
      <p className="max-w-2xl text-sm text-ink-600 sm:text-base">
        {translation.aiSummary}
      </p>
      <Button
        size="lg"
        className="px-12 shadow-2xl shadow-ink-300/70 transition-transform hover:-translate-y-[1px]"
        onClick={handleStart}
      >
        {translation.cta}
      </Button>
    </section>
  );
}
