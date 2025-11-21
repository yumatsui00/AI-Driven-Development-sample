import PrimaryButton from "@/components/primary-button";

export default function Hero() {
  return (
    <section className="glass-panel mx-auto mt-10 w-full max-w-5xl bg-gradient-to-br from-ink-900/70 via-ink-900/40 to-indigo-600/10 px-8 py-10 sm:px-12 sm:py-14">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs uppercase tracking-[0.26em] text-indigo-200">
            next.js starter
          </p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
            Ship faster with Tailwind and clean import aliases
          </h1>
          <p className="text-base text-slate-200/80">
            Opinionated defaults: App Router, dark-ready styles, and {"'@/'"}
            path imports for components and utilities. Start prototyping without
            wrestling the setup.
          </p>
        </div>
        <div className="flex gap-3">
          <PrimaryButton href="https://nextjs.org/docs" variant="solid">
            Read docs
          </PrimaryButton>
          <PrimaryButton href="https://tailwindcss.com/docs" variant="ghost">
            Tailwind guide
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
