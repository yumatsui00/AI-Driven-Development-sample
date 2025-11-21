import type { Feature } from "@/lib/features";
import { features } from "@/lib/features";

const accentMap: Record<string, string> = {
  velocity: "from-indigo-400/30 to-cyan-400/20",
  safety: "from-emerald-400/30 to-lime-300/20",
  stability: "from-orange-300/30 to-amber-200/20"
};

export default function FeatureGrid() {
  return (
    <section className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="glass-panel relative overflow-hidden p-6"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${accentMap[feature.accent ?? "velocity"]} opacity-70 blur-3xl`}
            aria-hidden
          />
          <div className="relative space-y-3">
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="text-sm text-slate-200/80">{feature.description}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
