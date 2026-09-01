"use client";

import { useState } from "react";
import { Reveal } from "@/components/layout/reveal";
import { SectionHeader } from "@/components/layout/section-header";
import { experience } from "@/lib/data/experience";

const COLLAPSED_BULLET_COUNT = 3;

export function ExperienceSection() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  return (
    <section id="experience" className="mx-auto w-full max-w-content px-6 py-16">
      <SectionHeader index="02" title="Experience" />
      <div className="space-y-4">
        {experience.map((entry, index) => {
          const isOpen = !!expanded[index];
          const hasMore = entry.bullets.length > COLLAPSED_BULLET_COUNT;
          const visibleBullets = isOpen ? entry.bullets : entry.bullets.slice(0, COLLAPSED_BULLET_COUNT);

          return (
            <Reveal key={entry.company}>
              <article className="rounded-2xl border bg-surface/30 p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 sm:hover:-translate-y-0.5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 data-trace-group={`exp-${index}`} className="font-medium text-fg">
                      {entry.company}
                    </h3>
                    <p className="mt-2 text-sm text-accent">{entry.role}</p>
                  </div>
                  <span className="flex-none font-mono text-xs text-faint">
                    {entry.start} — {entry.end}
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {visibleBullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-full bg-faint" />
                      <span className="text-pretty">{bullet}</span>
                    </li>
                  ))}
                </ul>
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setExpanded((s) => ({ ...s, [index]: !s[index] }))}
                    aria-expanded={isOpen}
                    className="mt-4 cursor-pointer font-mono text-xs font-medium text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {isOpen ? "Show less" : `View ${entry.bullets.length - COLLAPSED_BULLET_COUNT} more`}
                  </button>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
