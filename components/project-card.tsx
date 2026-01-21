"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/cn";

export function ProjectCard({ project }: { project: Project }) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-xl border border-border bg-bg-raised">
      {showDemo ? (
        <div className="relative h-full w-full">
          <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
            <source src={project.video} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={() => setShowDemo(false)}
            className={cn(
              "absolute bottom-3 right-3 rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium text-text",
              "hover:border-accent hover:text-accent-strong"
            )}
          >
            Back to Details
          </button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.thumbnail} alt={`${project.title} thumbnail`} className="h-40 w-full object-cover" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
            <h3 className="font-semibold text-text">{project.title}</h3>
            <p className="flex-1 text-sm text-text-dim">{project.desc}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:border-accent hover:text-accent-strong"
              >
                Play Demo
              </button>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:border-accent hover:text-accent-strong"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
