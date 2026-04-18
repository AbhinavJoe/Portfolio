"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useCanRender3D } from "@/lib/hooks/use-can-render-3d";
import { HeroSceneFallback } from "./hero-scene-fallback";

const HeroScene = dynamic(() => import("./hero-scene").then((mod) => mod.HeroScene), {
  ssr: false,
});

export function HeroSection() {
  const canRender3D = useCanRender3D();

  return (
    <section
      id="hero"
      className="relative mx-auto grid max-w-5xl grid-cols-1 items-end gap-10 overflow-hidden px-6 pb-16 pt-16 md:grid-cols-[1.35fr_0.8fr] md:pb-20 md:pt-24"
    >
      {canRender3D ? <HeroScene /> : <HeroSceneFallback />}

      <div>
        <p
          data-trace-group="hero-role"
          className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--accent-strong)_40%,transparent)] px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-accent-strong"
        >
          <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
          Software Engineer
        </p>
        <h1 className="mt-6 text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-tight text-text sm:text-6xl md:text-7xl">
          Abhinav Joshi
        </h1>
        <p className="mt-5 max-w-[30ch] text-pretty text-lg text-text-dim sm:text-xl">
          I build the load-bearing parts — auth, task queues, the service three other services
          quietly depend on.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className={buttonVariants({ variant: "primary", size: "md" })}>
            See the work
          </a>
          <Link href="/blog" className={buttonVariants({ variant: "outline", size: "md" })}>
            Read the writing
          </Link>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-x-[8%] -inset-y-[10%] -z-10 blur-2xl"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 40%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 72%)",
          }}
        />
        <Image
          src="/images/profile.jpg"
          alt="Abhinav Joshi"
          width={480}
          height={600}
          className="aspect-[4/5] w-full rounded-lg object-cover object-top grayscale-[35%] contrast-[1.05]"
          priority
        />
      </div>
    </section>
  );
}
