"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaXmark, FaGithub } from "react-icons/fa6";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
];

const ICON_BUTTON =
  "grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        aria-label="Primary"
        className="relative flex w-full max-w-3xl items-center justify-between rounded-full border border-border bg-bg/70 px-4 py-2 backdrop-blur-md"
      >
        <Link href="/" className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight">
          <Image
            src="/images/profile.jpg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-accent/30 transition-transform group-hover:rotate-12"
          />
          <span className="hidden sm:inline">abhinav</span>
          <span className="sr-only sm:hidden">abhinav, home</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/abhinavjoe"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className={ICON_BUTTON}
          >
            <FaGithub size={16} />
          </a>
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={`${ICON_BUTTON} md:hidden`}
          >
            {open ? <FaXmark size={16} /> : <FaBars size={16} />}
          </button>
        </div>

        {open && (
          <ul className="absolute inset-x-0 top-full mt-2 flex flex-col rounded-2xl border border-border bg-bg/95 p-2 backdrop-blur-md md:hidden">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-muted transition-colors hover:bg-fg/5 hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
