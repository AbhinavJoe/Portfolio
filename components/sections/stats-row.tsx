import { heroStat } from "@/lib/data/stats";

export function StatsRow() {
  return (
    <div className="mx-auto max-w-5xl border-y border-border px-6">
      <div className="flex items-baseline gap-3 py-5">
        <span className="font-heading text-2xl font-semibold tracking-tight text-accent-strong">
          {heroStat.value}
        </span>
        <span className="font-mono text-[10.5px] uppercase tracking-wide text-text-dim">
          {heroStat.label}
        </span>
      </div>
    </div>
  );
}
