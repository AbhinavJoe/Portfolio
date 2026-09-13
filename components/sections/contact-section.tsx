import { ContactForm } from "@/components/contact-form";
import { Socials } from "@/components/socials";
import { RepoList } from "@/components/repo-list";

export function ContactSection() {
  return (
    <footer id="contact" className="mx-auto max-w-5xl px-6 pb-20 pt-16 md:pb-28">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-4 border-t border-border pt-10">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-text">
            Let&apos;s talk shop.
          </h2>
          <p className="mt-1.5 text-sm text-text-dim">
            Backend, infra, or a queue that keeps double-firing.
          </p>
        </div>
        <span className="flex-1" />
        <Socials />
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
        <div className="flex flex-col items-center">
          <img
            src="https://raw.githubusercontent.com/AbhinavJoe/AbhinavJoe/main/public/lain-monitor.gif"
            alt="Lain, Serial Experiments Lain, watching a terminal glow"
            className="h-80 w-auto dark:hidden"
          />
          <img
            src="https://raw.githubusercontent.com/AbhinavJoe/AbhinavJoe/main/public/lain-desk.gif"
            alt="Lain, Serial Experiments Lain, at her desk at night"
            className="h-80 w-auto hidden dark:block"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-mono text-[11px] uppercase tracking-wide text-text-dim">
            GitHub Repositories
          </h3>
          <div className="h-80">
            <RepoList />
          </div>
        </div>
      </div>
    </footer>
  );
}
