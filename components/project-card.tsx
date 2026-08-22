"use client";

import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/cn";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-accent";

export function ProjectCard({
  project,
  isPlaying,
  onPlayDemo,
  onStopDemo,
}: {
  project: Project;
  isPlaying: boolean;
  onPlayDemo: () => void;
  onStopDemo: () => void;
}) {
  const hasDemo = project.hasDemo !== false;

  return (
    <div className="group relative h-[380px] w-full overflow-hidden rounded-xl border border-border bg-bg-raised transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-accent">
      {isPlaying && hasDemo ? (
        <div className="relative h-full w-full">
          <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
            <source src={project.video} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={onStopDemo}
            className={cn(
              "absolute bottom-3 right-3 rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium text-text",
              "hover:border-accent hover:text-accent-strong",
              FOCUS_RING
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
            <div className="flex items-baseline gap-2">
              <h3 className="flex-1 font-heading text-[15.5px] font-semibold tracking-tight text-text">
                {project.title}
              </h3>
              <span aria-hidden className="font-mono text-xs text-accent-strong">
                ↗
              </span>
            </div>
            <p className="flex-1 text-[13px] leading-relaxed text-text-dim">{project.desc}</p>
            <div className="flex gap-2.5">
              {hasDemo && (
                <button
                  type="button"
                  onClick={onPlayDemo}
                  className={cn(
                    "rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim hover:border-accent hover:text-accent-strong",
                    FOCUS_RING
                  )}
                >
                  Play Demo
                </button>
              )}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim hover:border-accent hover:text-accent-strong",
                  FOCUS_RING
                )}
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
