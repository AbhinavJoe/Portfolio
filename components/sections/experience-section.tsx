import { experience } from "@/lib/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">Experience</h2>
      <div className="flex flex-col gap-16">
        {experience.map((entry) => (
          <article key={entry.company} data-experience-item className="border-l-2 border-border pl-6">
            <h3 className="text-xl font-semibold text-text">{entry.company}</h3>
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
