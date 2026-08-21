import { Reveal } from "@/components/layout/reveal";

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-6 font-mono text-sm uppercase tracking-wide text-teal">About</h2>
      <Reveal>
        <p className="text-lg leading-relaxed text-text-dim">
          I&apos;m a backend-leaning software engineer who ends up owning whatever&apos;s load-bearing —
          auth, task queues, the service that three other services quietly depend on. Most
          recently that&apos;s meant pulling authentication out of a monolith, replacing a task queue
          under production LLM traffic without anyone noticing, and leading a frontend for a
          legal SaaS product I didn&apos;t start on. I like systems with clear boundaries and code
          that&apos;s still legible after the person who wrote it has moved on — usually me, six
          months later.
        </p>
      </Reveal>
    </section>
  );
}
