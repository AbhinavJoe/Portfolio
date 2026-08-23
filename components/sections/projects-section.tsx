"use client";

import { useState } from "react";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/layout/reveal";

export function ProjectsSection() {
  // Lifted up so starting one project's demo stops whichever other one was
  // already playing, instead of every card tracking its own demo state in
  // isolation and letting several videos run at once.
  const [playingTitle, setPlayingTitle] = useState<string | null>(null);

  return (
    <section
      id="projects"
      className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-20 md:grid-cols-[148px_1fr] md:py-28"
    >
      <h2
        data-trace-group="projects"
        className="pt-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim"
      >
        <span aria-hidden="true">03 / </span>Projects
      </h2>
      <Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              isPlaying={playingTitle === project.title}
              onPlayDemo={() => setPlayingTitle(project.title)}
              onStopDemo={() => setPlayingTitle((current) => (current === project.title ? null : current))}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
