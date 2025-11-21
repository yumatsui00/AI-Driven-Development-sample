"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-ink-50 to-ink-100 text-ink-900">
      <div className="pointer-events-none absolute -left-20 -top-32 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-200 via-cyan-100 to-white blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-gradient-to-br from-amber-100 via-pink-100 to-white blur-3xl" />
      <div className="relative mx-auto w-full max-w-5xl px-6 py-10">
        <Card>
          <CardHeader className="pb-0">
            <LandingHeader
              lang={lang}
              translation={translation}
              onChangeLang={onChangeLang}
            />
          </CardHeader>
          <CardContent>
            <LandingHero translation={translation} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
