import { Reveal } from "@/components/layout/reveal";
import { SectionHeader } from "@/components/layout/section-header";
import { heroStat } from "@/lib/data/stats";

const SNAPSHOT = [
  `${heroStat.value} — ${heroStat.label.toLowerCase()}.`,
  "Auth, task queues and analytics services running under real production traffic.",
  "Led the frontend of a legal SaaS product to production for 2 enterprise clients.",
  "Writing up the hard parts on the blog, one postmortem at a time.",
];

export function AboutSection() {
  return (
    <section id="about" className="mx-auto w-full max-w-content px-6 py-16">
      <SectionHeader index="01" title="About" traceGroup="about" />
      <Reveal>
        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <p>
            I&apos;m a backend-leaning software engineer who ends up owning whatever&apos;s
            load-bearing — auth, task queues, the service that three other services quietly depend
            on.
          </p>
          <p>
            Most recently that&apos;s meant pulling authentication out of a monolith, replacing a
            task queue under production LLM traffic without anyone noticing, and leading a
            frontend for a legal SaaS product I didn&apos;t start on.
          </p>
          <p>
            I like systems with clear boundaries and code that&apos;s still legible after the
            person who wrote it has moved on — usually me, six months later.
          </p>
        </div>
        <div className="mt-8 rounded-2xl border bg-surface/30 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Developer Snapshot
          </p>
          <ul className="mt-3 space-y-2">
            {SNAPSHOT.map((line) => (
              <li key={line} className="flex gap-3 text-muted">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
