"use client";

import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa6";

const USERNAME = "abhinavjoe";
const PROFILE_URL = `https://github.com/${USERNAME}`;
// Public mirror of GitHub's contribution calendar (GitHub's own API needs a
// token, which a static portfolio can't hold).
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`;

type Day = { date: string; count: number; level: number };
type Activity = { total: number; weeks: (Day | null)[][] };

// Monochrome ramp off the page's own accent token, so it follows the theme:
// white-on-black in dark mode, black-on-white in light. Level 0 is a faint
// fill, so empty days still read as a grid.
const LEVEL_CLASS = [
  "bg-fg/[0.07]",
  "bg-accent/25",
  "bg-accent/45",
  "bg-accent/70",
  "bg-accent",
];

// Group the flat day list into Sunday-first week columns, padding the first
// week so each date lands on its real weekday row.
function toWeeks(days: Day[]): (Day | null)[][] {
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = Array(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).fill(null);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push(week);
  return weeks;
}

function parse(raw: unknown): Activity | null {
  const data = raw as { total?: { lastYear?: number }; contributions?: Day[] };
  if (!data?.contributions?.length) return null;
  const days = data.contributions.filter((d) => d && typeof d.date === "string");
  if (!days.length) return null;
  const total = data.total?.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
  return { total, weeks: toWeeks(days) };
}

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function describe(day: Day): string {
  const when = dateFormat.format(new Date(`${day.date}T00:00:00Z`));
  if (day.count === 0) return `No contributions on ${when}`;
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${when}`;
}

// The same grid, empty, while loading — so the card never changes size.
const PLACEHOLDER_WEEKS: null[][] = Array.from({ length: 53 }, () => Array(7).fill(null));

export function GithubActivity() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(API_URL);
        const parsed = parse(await response.json());
        if (cancelled) return;
        if (parsed) setActivity(parsed);
        else setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const weeks = activity?.weeks ?? PLACEHOLDER_WEEKS;

  return (
    <div className="rounded-2xl border bg-surface/30 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-faint transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FaGithub aria-hidden size={13} />
          github activity
        </a>
        <span className="font-mono text-xs text-muted">
          {activity
            ? `${activity.total.toLocaleString("en-US")} contributions in the last year`
            : failed
              ? "couldn’t load activity"
              : " "}
        </span>
      </div>

      <div
        role="img"
        aria-label={
          activity
            ? `GitHub contribution graph: ${activity.total} contributions in the last year`
            : "GitHub contribution graph"
        }
        className={`mt-3 flex gap-[3px] ${activity ? "" : failed ? "opacity-40" : "animate-pulse"}`}
      >
        {weeks.map((week, w) => (
          // Phones only have room for roughly the last half-year of columns.
          <div
            key={w}
            className={`flex min-w-0 flex-1 flex-col gap-[3px] ${w < weeks.length - 27 ? "hidden sm:flex" : ""}`}
          >
            {Array.from({ length: 7 }, (_, d) => {
              const day = week[d] ?? null;
              return (
                <span
                  key={d}
                  title={day ? describe(day) : undefined}
                  className={`block aspect-square w-full rounded-[2px] ${
                    day
                      ? LEVEL_CLASS[Math.min(Math.max(day.level, 0), 4)]
                      : activity
                        ? "bg-transparent" // padding before the first real day
                        : LEVEL_CLASS[0] // loading / failed: a quiet empty grid
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-[10px] text-faint" aria-hidden>
        less
        {LEVEL_CLASS.map((cls) => (
          <span key={cls} className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
        ))}
        more
      </div>
    </div>
  );
}
