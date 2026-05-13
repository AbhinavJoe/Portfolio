import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center gap-7 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-mono text-sm text-text">
          <span
            aria-hidden
            className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
          />
          abhinav joshi
        </Link>
        <div className="flex-1" />
        <ul className="flex items-center gap-6 text-sm text-text-dim">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-accent-strong">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href="https://github.com/abhinavjoe"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-text-dim transition-colors hover:border-accent hover:text-accent-strong"
        >
          Github
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}
