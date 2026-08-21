"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/lib/data/experience";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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
    <section id="experience" ref={sectionRef} className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">Experience</h2>
      <div className="flex flex-col gap-16">
        {experience.map((entry, index) => (
          <article key={entry.company} data-experience-item className="border-l-2 border-border pl-6">
            <h3 data-trace-group={`exp-${index}`} className="text-xl font-semibold text-text">
              {entry.company}
            </h3>
            <p className="text-sm text-text-dim">
              {entry.role} · {entry.start} — {entry.end}
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-text-dim">
              {entry.bullets.map((bullet) => (
                <li key={bullet} className="leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
