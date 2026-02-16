"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
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
      className="relative mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 overflow-hidden px-6 py-24 md:flex-row md:py-32"
    >
      {canRender3D ? <HeroScene /> : <HeroSceneFallback />}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <p className="font-mono text-sm uppercase tracking-wide text-teal">Software Engineer</p>
        <h1 className="text-4xl font-bold text-text md:text-6xl">Abhinav Joshi</h1>
        <p className="max-w-prose text-lg text-text-dim">
          I build backend systems, auth, and data pipelines — currently at Panaroma Intelligence
          Solutions, shipping multi-tenant infrastructure and LLM-backed products in production.
        </p>
        <div className="flex justify-center gap-4 md:justify-start">
          <a href="#projects" className={buttonVariants({ variant: "primary", size: "md" })}>
            See projects
          </a>
          <a href="/blog" className={buttonVariants({ variant: "outline", size: "md" })}>
            Read the blog
          </a>
        </div>
      </div>
      <div className="aspect-square w-56 shrink-0 overflow-hidden rounded-full border-4 border-accent md:w-72">
        <Image
          src="/images/profile.jpg"
          alt="Abhinav Joshi"
          width={480}
          height={480}
          className="h-full w-full object-cover object-top"
          priority
        />
      </div>
    </section>
  );
}
