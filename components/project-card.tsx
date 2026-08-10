"use client";

import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/cn";

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

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
  const showVideo = isPlaying && hasDemo;

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-surface/30 p-5 backdrop-blur-lg transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-fg/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative">
        <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border bg-fg/[0.03]">
          {showVideo ? (
            <>
              <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
                <source src={project.video} type="video/mp4" />
              </video>
              <button
                type="button"
                onClick={onStopDemo}
                className={cn(
                  "absolute bottom-2 right-2 cursor-pointer rounded-full border bg-bg/90 px-3 py-1 font-mono text-xs text-fg backdrop-blur hover:border-accent/50",
                  FOCUS_RING
                )}
              >
                Back to Details
              </button>
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.thumbnail}
              alt={`${project.title} thumbnail`}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>

        {(project.status || project.year) && (
          <div className="mb-2 flex items-center justify-between gap-3">
            {project.status ? (
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {project.status}
              </span>
            ) : (
              <span />
            )}
            {project.year && <span className="font-mono text-xs text-faint">{project.year}</span>}
          </div>
        )}
        <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
          {project.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{project.desc}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li key={s}>
              <Badge>{s}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mt-5 flex items-center gap-4 text-sm">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("font-medium text-fg transition-colors hover:text-accent", FOCUS_RING)}
        >
          GitHub
        </a>
        {hasDemo && !showVideo && (
          <button
            type="button"
            onClick={onPlayDemo}
            className={cn(
              "cursor-pointer font-mono text-xs font-medium text-muted transition-colors hover:text-accent",
              FOCUS_RING
            )}
          >
            Play Demo
          </button>
        )}
      </div>
    </article>
  );
}
