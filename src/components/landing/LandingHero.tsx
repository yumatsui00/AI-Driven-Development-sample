import { Button } from "@/components/ui/button";
import type { LandingHeroProps } from "@/types/landing";

/**
 * Hero section with headline, description, and CTA.
 */
export default function LandingHero({ translation }: LandingHeroProps) {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pb-14 text-center">
      <p className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-500 shadow-sm">
        {translation.appName}
      </p>
      <h1 className="text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl">
        {translation.tagline}
      </h1>
      <p className="max-w-3xl text-base text-ink-600 sm:text-lg">
        {translation.description}
      </p>
      <p className="max-w-3xl text-sm text-ink-500 sm:text-base">
        {translation.aiSummary}
      </p>
      <Button size="lg" className="px-8 shadow-lg shadow-ink-200/80">
        {translation.cta}
      </Button>
    </section>
  );
}
