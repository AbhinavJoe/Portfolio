import { Reveal } from "@/components/layout/reveal";
import { SectionHeader } from "@/components/layout/section-header";
import { skillGroups } from "@/lib/data/skills";

export function SkillsSection() {
  return (
    <section id="skills" className="mx-auto w-full max-w-content px-6 py-16">
      <SectionHeader index="04" title="Skills & Technologies" />
      <Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-faint">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border bg-bg/40 px-2 py-0.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/30 hover:text-fg"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
