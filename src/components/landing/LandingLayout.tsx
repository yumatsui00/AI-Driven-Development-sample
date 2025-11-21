"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import type { LandingLayoutProps } from "@/types/landing";

/**
 * Layout wrapper for the landing page, combining header and hero.
 */
export default function LandingLayout({
  lang,
  translation,
  onChangeLang
}: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-ink-50 to-ink-100 text-ink-900">
      <div className="mx-auto w-full max-w-6xl">
        <LandingHeader
          lang={lang}
          translation={translation}
          onChangeLang={onChangeLang}
        />
        <LandingHero translation={translation} />
      </div>
    </div>
  );
}
