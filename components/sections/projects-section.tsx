import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/layout/reveal";

export function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <h2 data-trace-group="projects" className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">
        Projects
      </h2>
      <Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
