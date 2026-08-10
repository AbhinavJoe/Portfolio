"use client";

import { useState } from "react";
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/layout/reveal";
import { SectionHeader } from "@/components/layout/section-header";

export function ProjectsSection() {
  // Lifted up so starting one project's demo stops whichever other one was
  // already playing, instead of every card tracking its own demo state in
  // isolation and letting several videos run at once.
  const [playingTitle, setPlayingTitle] = useState<string | null>(null);

  return (
    <section id="projects" className="mx-auto w-full max-w-content px-6 py-16">
      <SectionHeader index="03" title="Projects" traceGroup="projects" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Reveal key={project.title}>
            <ProjectCard
              project={project}
              isPlaying={playingTitle === project.title}
              onPlayDemo={() => setPlayingTitle(project.title)}
              onStopDemo={() => setPlayingTitle((current) => (current === project.title ? null : current))}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
