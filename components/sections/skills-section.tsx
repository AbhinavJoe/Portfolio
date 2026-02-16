import { skillGroups } from "@/lib/data/skills";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/layout/reveal";

export function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">Skills</h2>
      <Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <h3 className="mb-3 font-semibold text-text">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
