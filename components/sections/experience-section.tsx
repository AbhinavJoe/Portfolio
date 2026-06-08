"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/lib/data/experience";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const COLLAPSED_BULLET_COUNT = 3;

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const items = sectionRef.current.querySelectorAll("[data-experience-item]");
    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 80%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-20 md:grid-cols-[148px_1fr] md:py-28"
    >
      <h2 className="pt-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim">
        <span aria-hidden="true">02 / </span>Experience
      </h2>
      <div className="flex flex-col gap-12">
        {experience.map((entry, index) => {
          const isOpen = !!expanded[index];
          const hasMore = entry.bullets.length > COLLAPSED_BULLET_COUNT;
          const visibleBullets = isOpen ? entry.bullets : entry.bullets.slice(0, COLLAPSED_BULLET_COUNT);

          return (
            <article key={entry.company} data-experience-item>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-3">
                <h3
                  data-trace-group={`exp-${index}`}
                  className="font-heading text-xl font-semibold tracking-tight text-text"
                >
                  {entry.company}
                </h3>
                <span className="text-sm text-text-dim">{entry.role}</span>
                <span className="flex-1" />
                <span className="font-mono text-[11.5px] tracking-wide text-text-dim">
                  {entry.start} — {entry.end}
                </span>
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {visibleBullets.map((bullet) => (
                  <li key={bullet} className="grid grid-cols-[14px_1fr] gap-2.5 text-[14.5px] leading-relaxed text-text-dim">
                    <span className="pt-0.5 font-mono text-xs text-accent-strong">—</span>
                    <span className="text-pretty">{bullet}</span>
                  </li>
                ))}
              </ul>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setExpanded((s) => ({ ...s, [index]: !s[index] }))}
                  aria-expanded={isOpen}
                  className="mt-3 rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim transition-colors hover:border-accent hover:text-accent-strong"
                >
                  {isOpen ? "Show less" : `+ ${entry.bullets.length - COLLAPSED_BULLET_COUNT} more`}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
