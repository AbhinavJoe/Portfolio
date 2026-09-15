import { LocalClock } from "@/components/local-clock";
import { Socials } from "@/components/socials";

export function ContactSection() {
  return (
    <footer id="contact" className="mx-auto w-full max-w-content px-6 pb-10 pt-16">
      <div className="grid grid-cols-1 items-center gap-10 rounded-2xl border bg-surface/30 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/AbhinavJoe/AbhinavJoe/main/public/lain-monitor.gif"
          alt="Lain, Serial Experiments Lain, watching a terminal glow"
          loading="lazy"
          className="mx-auto h-56 w-auto rounded-xl dark:hidden"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://raw.githubusercontent.com/AbhinavJoe/AbhinavJoe/main/public/lain-desk.gif"
          alt="Lain, Serial Experiments Lain, at her desk at night"
          loading="lazy"
          className="mx-auto hidden h-56 w-auto rounded-xl dark:block"
        />
        <div className="text-center sm:col-start-2 sm:row-start-1 sm:text-left">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Contact</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s talk shop.</h2>
          <p className="mt-3 text-muted">Backend, infra, or a queue that keeps double-firing.</p>
          <div className="mt-6 flex justify-center sm:justify-start">
            <Socials />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        <p className="text-xs text-faint">
          &copy; {new Date().getFullYear()} Abhinav Joshi · Built with Next.js &amp; too much coffee
        </p>
        <LocalClock />
      </div>
    </footer>
  );
}
