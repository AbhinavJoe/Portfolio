import { skillGroups } from "@/lib/data/skills";
import { Reveal } from "@/components/layout/reveal";

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[148px_1fr]">
        <h2
          data-trace-group="about"
          className="pt-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim"
        >
          <span aria-hidden="true">01 / </span>About
        </h2>
        <Reveal>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_0.78fr]">
            <div>
              <p className="max-w-[58ch] text-pretty text-[16.5px] leading-relaxed text-text">
                I&apos;m a backend-leaning software engineer who ends up owning whatever&apos;s
                load-bearing — auth, task queues, the service that three other services quietly
                depend on. Most recently that&apos;s meant pulling authentication out of a
                monolith, replacing a task queue under production LLM traffic without anyone
                noticing, and leading a frontend for a legal SaaS product I didn&apos;t start on.
              </p>
              <p className="mt-4 max-w-[58ch] text-pretty text-[16.5px] leading-relaxed text-text-dim">
                I like systems with clear boundaries and code that&apos;s still legible after the
                person who wrote it has moved on — usually me, six months later.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {skillGroups.map((group) => (
                <div key={group.category}>
                  <h3
                    data-trace-group="about"
                    className="mb-2 font-mono text-[10.5px] uppercase tracking-wide text-text-dim"
                  >
                    {group.category}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-dim">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
