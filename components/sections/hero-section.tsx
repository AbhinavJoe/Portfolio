import Image from "next/image";
import { GithubActivity } from "@/components/github-activity";
import { Typewriter } from "@/components/typewriter";
import { Socials } from "@/components/socials";
import { availability, building, learning, rolePhrases } from "@/lib/data/status";

const CARD = "rounded-2xl border bg-surface/30 px-4 py-3 text-sm";
const CARD_LABEL = "font-mono text-xs uppercase tracking-wider text-faint";

export function HeroSection() {
  return (
    <section id="hero" className="relative flex min-h-[92vh] items-center overflow-x-clip px-6">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[46rem] w-[60rem] max-w-[100vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(var(--accent)/0.07),transparent)]"
      />

      <div className="mx-auto w-full max-w-content pb-12 pt-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 select-none sm:h-28 sm:w-28 md:h-32 md:w-32">
            <Image
              src="/images/profile.jpg"
              alt="Abhinav Joshi"
              width={256}
              height={256}
              priority
              className="h-full w-full rounded-2xl border border-border object-cover object-top shadow-xl"
            />
            {/* CRT scanlines + a slow sweeping bar over the portrait. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20"
            >
              <div className="animate-scanline absolute inset-0 h-1 bg-white/30 blur-[1px]" />
            </div>
          </div>

          <h1 className="text-[2.2rem] font-bold leading-[1.05] tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-fg to-muted bg-clip-text text-transparent">
              Abhinav Joshi.
            </span>
            <br />
            <span
              data-trace-group="hero-role"
              className="inline-block font-mono text-xl font-medium text-muted sm:text-2xl"
            >
              <Typewriter phrases={rolePhrases} />
              <span aria-hidden className="animate-blink ml-1 inline-block h-[1em] w-[2px] translate-y-[3px] bg-muted/60" />
            </span>
          </h1>
        </div>

        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:mt-8 sm:text-lg">
          I build the load-bearing parts — auth, task queues, the service three other services
          quietly depend on.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-all duration-300 hover:scale-[1.05] hover:shadow-lg hover:shadow-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            See the work
          </a>
          <Socials traced />
        </div>

        <ul aria-label="Current status" className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-3">
          <li className={`${CARD} flex items-center gap-2`}>
            <span aria-hidden className="relative flex h-2 w-2">
              {availability.open && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 motion-safe:animate-ping" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${availability.open ? "bg-emerald-400" : "bg-faint"}`}
              />
            </span>
            <span className="text-muted">
              {availability.open ? availability.openLabel : availability.closedLabel}
            </span>
          </li>
          <li className={CARD}>
            <span className={CARD_LABEL}>building</span>
            <p className="mt-0.5 line-clamp-2 text-muted">{building}</p>
          </li>
          <li className={CARD}>
            <span className={CARD_LABEL}>learning</span>
            <p className="mt-0.5 line-clamp-2 text-muted">{learning.join(" · ")}</p>
          </li>
        </ul>

        <div className="mt-3">
          <GithubActivity />
        </div>
      </div>
    </section>
  );
}
