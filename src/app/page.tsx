import FeatureGrid from "@/components/feature-grid";
import Hero from "@/components/hero";

const steps = [
  { title: "Install", detail: "npm install" },
  { title: "Develop", detail: "npm run dev" },
  { title: "Style", detail: "Tailwind classes in app/**/*.tsx" },
  { title: "Import", detail: "Use '@/components/*' and '@/lib/*'" }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col px-6 pb-20 pt-8">
      <Hero />
      <FeatureGrid />
      <section className="mx-auto mt-12 flex w-full max-w-5xl flex-col gap-4 glass-panel p-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Get started</h2>
          <p className="text-sm text-slate-200/80">
            Run the commands below and start creating routes in the{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">
              app/
            </code>{" "}
            directory.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-white/5 bg-white/5 p-4"
            >
              <p className="text-xs uppercase tracking-wide text-indigo-200/70">
                {step.title}
              </p>
              <p className="text-sm text-white">{step.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
