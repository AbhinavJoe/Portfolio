# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild abhinavjoe.vercel.app from a CRA SPA into a Next.js 15 (App Router, TypeScript) site with a refreshed dark-first design system, resume-accurate content, a WebGL 3D hero with scroll-driven motion, and a new `/blog` section rendering the six already-written MDX posts.

**Architecture:** Next.js 15 App Router replaces `react-scripts`. Content (bio/skills/experience/projects) lives as typed TS data modules; blog posts live as MDX files under `content/blog/`, parsed with `gray-matter` and rendered via `next-mdx-remote/rsc`, statically generated at build time. Visual system runs on Tailwind CSS + CSS custom-property tokens (dark-first, light override), a small hand-rolled component layer (shadcn-style primitives via `cn()`), Framer Motion for reveals, GSAP ScrollTrigger for the pinned Experience timeline, Lenis for smooth scroll, and `@react-three/fiber`/`drei` for the hero scene — all gated behind `prefers-reduced-motion` and a device-capability check with a static fallback.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 3, Framer Motion, GSAP + ScrollTrigger, Lenis, three.js + @react-three/fiber + @react-three/drei, next-mdx-remote, gray-matter, reading-time, mermaid, next-themes, Jest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-21-portfolio-revamp-design.md`

## Global Constraints

- Stack is Next.js 15 App Router + TypeScript — no `react-scripts`/CRA remnants in the final tree.
- Design tokens are hand-picked, never derived from the profile photo or any other image (spec §4).
- All motion (Framer Motion, GSAP, the 3D scene) must respect `prefers-reduced-motion`.
- The 3D hero scene ships only when a capability check passes; everything else gets the static-gradient + 2D-motion fallback.
- The resume PDF stays out of the repo and out of the site entirely (already gitignored) — never add a resume download link or copy resume contact details (phone/personal email) into site content.
- Blog frontmatter schema is fixed (spec §3): `title, slug, date, tags, company, role, excerpt`.
- GitHub repo list keeps its current runtime client-side fetch to `api.github.com` — do not move it to build time.
- Every commit is local only — do not push to `origin` unless explicitly asked.

---

## File Structure

```
app/
  layout.tsx                     - root layout: fonts, ThemeProvider, SmoothScrollProvider, metadata
  globals.css                    - Tailwind directives + design token CSS custom properties
  page.tsx                       - home page, composes all sections
  blog/
    page.tsx                     - blog list page
    [slug]/
      page.tsx                   - blog post detail page
components/
  providers/
    theme-provider.tsx
    smooth-scroll-provider.tsx
  layout/
    site-header.tsx
    reveal.tsx                   - Framer Motion scroll-reveal wrapper
  sections/
    hero-section.tsx
    hero-scene.tsx                - r3f Canvas, dynamic-imported client component
    hero-scene-fallback.tsx
    about-section.tsx
    skills-section.tsx
    experience-section.tsx
    projects-section.tsx
    blog-preview-section.tsx
    contact-section.tsx
  project-card.tsx
  repo-list.tsx
  contact-form.tsx
  socials.tsx
  blog/
    post-card.tsx
    tag-filter.tsx
    mdx-components.tsx
    mermaid-diagram.tsx
  ui/
    button.tsx
    badge.tsx
lib/
  data/
    experience.ts
    skills.ts
    projects.ts
  blog.ts
  hooks/
    use-prefers-reduced-motion.ts
    use-can-render-3d.ts
  cn.ts
content/
  blog/
    *.mdx                        - moved from repo root blog-draft-*.mdx
public/
  images/
    profile.jpg                  - moved from src/assets/images/img.jpg
  samples/*.mp4                  - unchanged
  thumbnail/*.png                - unchanged
tailwind.config.ts
next.config.mjs
tsconfig.json
jest.config.ts
jest.setup.ts
package.json
```

---

### Task 1: Scaffold Next.js, remove CRA tooling, set up Jest

**Files:**
- Create: `package.json` (overwrite), `tsconfig.json`, `next.config.mjs`, `next-env.d.ts`, `jest.config.ts`, `jest.setup.ts`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (minimal placeholders, filled in Task 2+)
- Delete: `src/index.js`, `src/App.js`, `src/App.test.js`, `src/reportWebVitals.js`, `src/setupTests.js`, `public/index.html`
- Test: `lib/__tests__/sanity.test.ts`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm run test` scripts; `app/layout.tsx` exporting default `RootLayout({ children }: { children: React.ReactNode })`.

- [ ] **Step 1: Install dependencies**

```bash
npm install next@15 react@19 react-dom@19
npm install -D typescript @types/react @types/react-dom @types/node
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-node
npm install clsx tailwind-merge class-variance-authority lucide-react next-themes
npm uninstall react-scripts cra-template web-vitals
```

- [ ] **Step 2: Write `package.json` scripts**

```json
{
  "name": "portfolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  }
}
```

Keep the `dependencies`/`devDependencies` blocks npm just wrote; only replace the `scripts` section and drop the CRA `eslintConfig`/`browserslist` blocks (Next.js supplies its own lint config via `next lint`).

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 5: Write `app/layout.tsx` (placeholder body, expanded in Task 4)**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abhinav Joshi",
  description: "Software Engineer — backend systems, infra, and the occasional 3D scene.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Write `app/page.tsx` (placeholder, expanded in Task 10)**

```tsx
export default function HomePage() {
  return <main>Portfolio rebuild in progress.</main>;
}
```

- [ ] **Step 7: Write `app/globals.css` (placeholder, expanded in Task 2)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Write minimal `tailwind.config.ts` and `postcss.config.js`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

```js
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 9: Write `jest.config.ts` and `jest.setup.ts`**

```ts
import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customConfig: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEach: [],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default createJestConfig(customConfig);
```

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 10: Write the sanity test**

```ts
// lib/__tests__/sanity.test.ts
describe("project scaffold", () => {
  it("runs tests", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 11: Run the sanity test**

Run: `npm run test`
Expected: PASS — 1 test passed.

- [ ] **Step 12: Delete CRA-only files**

```bash
git rm src/index.js src/App.js src/App.test.js src/reportWebVitals.js src/setupTests.js public/index.html
```

- [ ] **Step 13: Verify the app builds**

Run: `npm run build`
Expected: build succeeds, emits a minimal `/` route.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15, remove CRA tooling, add Jest"
```

---

### Task 2: Design tokens, fonts, theme provider

**Files:**
- Modify: `app/globals.css`, `tailwind.config.ts`
- Create: `components/providers/theme-provider.tsx`, `lib/cn.ts`, `components/ui/button.tsx`, `components/ui/badge.tsx`
- Test: `lib/__tests__/cn.test.ts`

**Interfaces:**
- Produces: `cn(...classes: ClassValue[]): string`; CSS custom properties `--bg`, `--bg-raised`, `--text`, `--text-dim`, `--accent`, `--accent-strong`, `--teal`, `--border` usable as `bg-bg`, `text-text` etc. via Tailwind theme extension; `<ThemeProvider>` wrapping `next-themes`.

- [ ] **Step 1: Write `lib/cn.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Write the failing test**

```ts
// lib/__tests__/cn.test.ts
import { cn } from "../cn";

describe("cn", () => {
  it("merges tailwind classes, letting the later one win", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });

  it("drops falsy values", () => {
    expect(cn("text-sm", false, undefined, "font-bold")).toBe("text-sm font-bold");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- cn.test.ts`
Expected: FAIL — `lib/cn.ts` doesn't exist yet (write step 1 first if running strictly TDD-in-order; both are written together here since `cn` is a one-line utility).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- cn.test.ts`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Write design tokens into `app/globals.css`**

```css
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #f7f7fb;
  --bg-raised: #ffffff;
  --border: #e3e3ec;
  --text: #14151c;
  --text-dim: #565b6e;
  --accent: #6d5bd0;
  --accent-strong: #5844c4;
  --teal: #0f9c82;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0a0b10;
    --bg-raised: #12141c;
    --border: #23283380;
    --text: #e7e9f0;
    --text-dim: #9aa1b5;
    --accent: #8b7cf6;
    --accent-strong: #b7abff;
    --teal: #5fe3c4;
  }
}

:root[data-theme="dark"] {
  --bg: #0a0b10;
  --bg-raised: #12141c;
  --border: #23283380;
  --text: #e7e9f0;
  --text-dim: #9aa1b5;
  --accent: #8b7cf6;
  --accent-strong: #b7abff;
  --teal: #5fe3c4;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans, "IBM Plex Sans"), system-ui, sans-serif;
}
```

- [ ] **Step 6: Extend `tailwind.config.ts` with the tokens**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.mdx"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-raised": "var(--bg-raised)",
        border: "var(--border)",
        text: "var(--text)",
        "text-dim": "var(--text-dim)",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        teal: "var(--teal)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 7: Write `components/providers/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 8: Write `components/ui/button.tsx`**

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent-strong",
        outline: "border border-border text-text hover:border-accent hover:text-accent-strong",
        ghost: "text-text-dim hover:text-text",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

- [ ] **Step 9: Write `components/ui/badge.tsx`**

```tsx
import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-bg-raised px-2 py-0.5 font-mono text-xs text-text-dim",
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 10: Verify the build still passes**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: design tokens, theme provider, base ui primitives"
```

---

### Task 3: Content data layer (experience, skills, projects)

**Files:**
- Create: `lib/data/experience.ts`, `lib/data/skills.ts`, `lib/data/projects.ts`
- Test: `lib/data/__tests__/data.test.ts`

**Interfaces:**
- Produces:
  - `type ExperienceEntry = { company: string; role: string; start: string; end: string; bullets: string[] }` and `export const experience: ExperienceEntry[]`
  - `type SkillGroup = { category: string; items: string[] }` and `export const skillGroups: SkillGroup[]`
  - `type Project = { title: string; stack: string[]; desc: string; video: string; thumbnail: string; link: string }` and `export const projects: Project[]`

- [ ] **Step 1: Write the failing test**

```ts
// lib/data/__tests__/data.test.ts
import { experience } from "../experience";
import { skillGroups } from "../skills";
import { projects } from "../projects";

describe("content data", () => {
  it("has both resume roles in reverse-chronological order", () => {
    expect(experience.map((e) => e.company)).toEqual([
      "Panaroma Intelligence Solutions",
      "InvoLead Services Pvt. Ltd.",
    ]);
  });

  it("groups skills by resume category", () => {
    expect(skillGroups.map((g) => g.category)).toEqual([
      "Languages",
      "Development",
      "Infra/DevOps",
      "Data",
    ]);
  });

  it("includes KubeCentrix among the projects", () => {
    expect(projects.some((p) => p.title.includes("KubeCentrix"))).toBe(true);
  });

  it("keeps every project's demo assets pointing at public/", () => {
    for (const p of projects) {
      expect(p.video.startsWith("/samples/")).toBe(true);
      expect(p.thumbnail.startsWith("/thumbnail/")).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- data.test.ts`
Expected: FAIL — modules don't exist yet.

- [ ] **Step 3: Write `lib/data/experience.ts`**

```ts
export type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "Panaroma Intelligence Solutions",
    role: "Software Engineer",
    start: "Feb 2025",
    end: "Present",
    bullets: [
      "Migrated authentication out of the monolith backend into a standalone Python/FastAPI Auth Microservice with a self-hosted Keycloak identity provider, onboarding 12 organizations (58 users) across 3 products in production with multi-tenant, organization-level access segregation and Casbin-based RBAC.",
      "Re-architected the core backend's distributed task processing pipeline, migrating from Celery/Redis to Taskiq running on NATS JetStream, preventing duplicate execution of long-running LLM calls with an early-acknowledgment, durable pull-based consumer model split across three dedicated task queues.",
      "Owned an analytics microservice serving 2 products off a shared FastAPI router, using a per-request resolver and DI container to dispatch each route to product-specific services behind a common service protocol.",
      "Architected a natural-language-to-MongoDB-query chat pipeline with LLM-driven intent classification and safety checks, backed by Beanie ODM and Redis caching shared across both products.",
      "Engineered a document comparison feature and a custom auth handler authenticating requests via Kong-injected headers, on top of Syncfusion's Document Editor reference backend (C#/ASP.NET Core), extending its Redis-backed collaborative-editing operation store and autosave logic.",
      "Led the frontend of a legal CLMS B2B SaaS product to production for 2 enterprise clients using TypeScript, Next.js 15, Redux Toolkit, and React Query, establishing conventions and reviewing 100% of frontend PRs from 2 engineers.",
    ],
  },
  {
    company: "InvoLead Services Pvt. Ltd.",
    role: "Software Developer Intern",
    start: "May 2024",
    end: "Jul 2024",
    bullets: [
      "Contributed to rebuilding a React product in TypeScript and Next.js 14.",
      "Used Next.js server-side capabilities to write end-to-end authentication.",
      "Used ChromaDB and Node.js for data embedding, vector storage, and retrieval in the product's RAG pipeline.",
    ],
  },
];
```

- [ ] **Step 4: Write `lib/data/skills.ts`**

```ts
export type SkillGroup = { category: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { category: "Languages", items: ["JavaScript / TypeScript", "Python", "C#", "C++"] },
  { category: "Development", items: ["React", "Next.js", "Express", "Flask", "FastAPI", "ASP.NET Core"] },
  {
    category: "Infra/DevOps",
    items: ["AWS (EC2, EBS, RDS, ElastiCache)", "Azure", "Docker", "Nginx", "Kong", "Keycloak"],
  },
  { category: "Data", items: ["MongoDB", "PostgreSQL", "Redis", "NATS JetStream"] },
];
```

- [ ] **Step 5: Write `lib/data/projects.ts`**

```ts
export type Project = {
  title: string;
  stack: string[];
  desc: string;
  video: string;
  thumbnail: string;
  link: string;
};

export const projects: Project[] = [
  {
    title: "KubeCentrix: Fraud Detector",
    stack: ["JavaScript", "Manifest v3", "Flask", "Machine Learning"],
    desc: "Hackathon-winning Chrome extension (Rajasthan Police Hackathon 1.0) that blocks fraudulent URLs using SSL checks, keyword analysis, and an ML model trained to 94.6% accuracy, backed by a Flask REST API.",
    video: "/samples/Reactflow.mp4",
    thumbnail: "/thumbnail/Reactflow.png",
    link: "https://github.com/AbhinavJoe/KubeCentrix",
  },
  {
    title: "Reactflow-X-DAG",
    stack: ["JavaScript", "React", "Zustand", "ReactFlow", "Python", "FastAPI"],
    desc: "Sample description",
    video: "/samples/Reactflow.mp4",
    thumbnail: "/thumbnail/Reactflow.png",
    link: "https://github.com/AbhinavJoe/Reactflow-X-DAG",
  },
  {
    title: "FinCentrix: AI Powered Financial Advisory",
    stack: ["JavaScript", "TypeScript", "Next.js", "Express", "ChromaDB", "Docker", "Microsoft Azure"],
    desc: "FinCentrix is an innovative platform that offers personalized financial guidance, transforming how people handle their finances.",
    video: "/samples/FinCentrix.mp4",
    thumbnail: "/thumbnail/FinCentrix.png",
    link: "https://github.com/AbhinavJoe/FinCentrix-A-User-Centric-AI-Financial-Advisor",
  },
  {
    title: "Google Search Automation",
    stack: ["Python", "TkinterGUI"],
    desc: "A simple Python software to automate Google searches.",
    video: "/samples/Google.mp4",
    thumbnail: "/thumbnail/Google.png",
    link: "https://github.com/AbhinavJoe/Google-Search-Automation",
  },
  {
    title: "RAG-X-Langchain-JS",
    stack: ["JavaScript", "Node.js", "ChromaDB", "LangchainJS"],
    desc: "RAGXLangchainJS is a Multi-Doc RAG Application made using JavaScript, Node.js, LangChainJS, and ChromaDB to make your life easier.",
    video: "/samples/RAGXLangchain.mp4",
    thumbnail: "/thumbnail/RAGXLangchain.png",
    link: "https://github.com/AbhinavJoe/RAG-X-Langchain-JS",
  },
];
```

> **Note for the implementer:** `KubeCentrix` currently has no dedicated video/thumbnail asset in `public/`. It reuses the Reactflow assets as a placeholder above — swap in real KubeCentrix media (or a static thumbnail-only card) if/when Abhinav supplies it; don't block the rest of the plan on this.

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test -- data.test.ts`
Expected: PASS — 4 tests passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: typed content data for experience, skills, projects"
```

---

### Task 4: Root layout — fonts, providers, header

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/providers/smooth-scroll-provider.tsx`, `components/layout/site-header.tsx`
- Test: `components/layout/__tests__/site-header.test.tsx`

**Interfaces:**
- Consumes: `ThemeProvider` from Task 2.
- Produces: `<SiteHeader>` (nav with anchor links to home sections + `/blog`), `<SmoothScrollProvider>` wrapping `children`.

- [ ] **Step 1: Install motion/scroll libs**

```bash
npm install framer-motion lenis
```

- [ ] **Step 2: Write the failing test**

```tsx
// components/layout/__tests__/site-header.test.tsx
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "../site-header";

describe("SiteHeader", () => {
  it("links to the blog", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
  });

  it("links to every home section anchor", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute("href", "/#experience");
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute("href", "/#projects");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- site-header.test.tsx`
Expected: FAIL — `site-header.tsx` doesn't exist yet.

- [ ] **Step 4: Write `components/layout/site-header.tsx`**

```tsx
import Link from "next/link";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-semibold text-text">
          abhinav joshi
        </Link>
        <ul className="flex gap-6 text-sm text-text-dim">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-accent-strong">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- site-header.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 6: Write `components/providers/smooth-scroll-provider.tsx`**

```tsx
"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 7: Wire providers + fonts into `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Abhinav Joshi",
  description: "Software Engineer — backend systems, infra, and the occasional 3D scene.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SmoothScrollProvider>
            <SiteHeader />
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

> Using `next/font/google` (not the `@import` in `globals.css` from Task 2) is the correct final state — it self-hosts the font at build time and avoids a render-blocking request. Remove the `@import` line from `app/globals.css` now that the fonts load through `next/font`.

- [ ] **Step 8: Remove the now-redundant `@import` line from `app/globals.css`**

Delete the `@import url("https://fonts.googleapis.com/...")` line added in Task 2 Step 5.

- [ ] **Step 9: Verify the build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: root layout with fonts, theme + smooth-scroll providers, site header"
```

---

### Task 5: Hero section (static — 3D added in Task 17)

**Files:**
- Create: `components/sections/hero-section.tsx`
- Modify: move `src/assets/images/img.jpg` → `public/images/profile.jpg` (`git mv`)
- Test: `components/sections/__tests__/hero-section.test.tsx`

**Interfaces:**
- Produces: `<HeroSection />`, default export, renders name/role/CTA and the profile image inside a token-bordered frame (no image-derived color — spec §4).

- [ ] **Step 1: Move the profile image**

```bash
mkdir -p public/images
git mv src/assets/images/img.jpg public/images/profile.jpg
git rm src/assets/images/white.png
```

- [ ] **Step 2: Write the failing test**

```tsx
// components/sections/__tests__/hero-section.test.tsx
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../hero-section";

describe("HeroSection", () => {
  it("renders the name and role", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { name: /abhinav joshi/i })).toBeInTheDocument();
    expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
  });

  it("renders the profile photo with descriptive alt text", () => {
    render(<HeroSection />);
    expect(screen.getByAltText(/abhinav joshi/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- hero-section.test.tsx`
Expected: FAIL — `hero-section.tsx` doesn't exist yet.

- [ ] **Step 4: Export `buttonVariants` from `components/ui/button.tsx`**

`Button` (Task 2) renders a native `<button>`, but the hero's two CTAs are links — so the hero uses the exported `buttonVariants` class-builder directly on `<a>` tags instead of the `Button` component. Change `const buttonVariants = cva(` to `export const buttonVariants = cva(` in `components/ui/button.tsx`.

- [ ] **Step 5: Write `components/sections/hero-section.tsx`**

```tsx
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="hero" className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-6 py-24 md:flex-row md:py-32">
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
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test -- hero-section.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: static hero section with token-framed profile photo"
```

---

### Task 6: About + Skills sections

**Files:**
- Create: `components/sections/about-section.tsx`, `components/sections/skills-section.tsx`
- Test: `components/sections/__tests__/skills-section.test.tsx`

**Interfaces:**
- Consumes: `skillGroups` from `lib/data/skills.ts` (Task 3).
- Produces: `<AboutSection />`, `<SkillsSection />`.

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/__tests__/skills-section.test.tsx
import { render, screen } from "@testing-library/react";
import { SkillsSection } from "../skills-section";

describe("SkillsSection", () => {
  it("renders every skill category from the data layer", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Infra/DevOps")).toBeInTheDocument();
    expect(screen.getByText(/Keycloak/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- skills-section.test.tsx`
Expected: FAIL — `skills-section.tsx` doesn't exist yet.

- [ ] **Step 3: Write `components/sections/about-section.tsx`**

```tsx
export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-6 font-mono text-sm uppercase tracking-wide text-teal">About</h2>
      <p className="text-lg leading-relaxed text-text-dim">
        I'm a backend-leaning software engineer who ends up owning whatever's load-bearing —
        auth, task queues, the service that three other services quietly depend on. Most
        recently that's meant pulling authentication out of a monolith, replacing a task queue
        under production LLM traffic without anyone noticing, and leading a frontend for a
        legal SaaS product I didn't start on. I like systems with clear boundaries and code
        that's still legible after the person who wrote it has moved on — usually me, six
        months later.
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Write `components/sections/skills-section.tsx`**

```tsx
import { skillGroups } from "@/lib/data/skills";
import { Badge } from "@/components/ui/badge";

export function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">Skills</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => (
          <div key={group.category}>
            <h3 className="mb-3 font-semibold text-text">{group.category}</h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- skills-section.test.tsx`
Expected: PASS — 1 test passed.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: about and skills sections"
```

---

### Task 7: Experience timeline section (static structure)

**Files:**
- Create: `components/sections/experience-section.tsx`
- Test: `components/sections/__tests__/experience-section.test.tsx`

**Interfaces:**
- Consumes: `experience` from `lib/data/experience.ts` (Task 3).
- Produces: `<ExperienceSection />`. Each entry renders with `data-experience-item` so Task 18's GSAP pin can select them without a rewrite.

- [ ] **Step 1: Write the failing test**

```tsx
// components/sections/__tests__/experience-section.test.tsx
import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "../experience-section";

describe("ExperienceSection", () => {
  it("renders both roles with their date ranges", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Panaroma Intelligence Solutions")).toBeInTheDocument();
    expect(screen.getByText("Feb 2025 — Present")).toBeInTheDocument();
    expect(screen.getByText("InvoLead Services Pvt. Ltd.")).toBeInTheDocument();
  });

  it("renders every bullet for each role", () => {
    render(<ExperienceSection />);
    expect(screen.getByText(/Keycloak identity provider/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- experience-section.test.tsx`
Expected: FAIL — `experience-section.tsx` doesn't exist yet.

- [ ] **Step 3: Write `components/sections/experience-section.tsx`**

```tsx
import { experience } from "@/lib/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">Experience</h2>
      <div className="flex flex-col gap-16">
        {experience.map((entry) => (
          <article key={entry.company} data-experience-item className="border-l-2 border-border pl-6">
            <h3 className="text-xl font-semibold text-text">{entry.company}</h3>
            <p className="text-sm text-text-dim">
              {entry.role} · {entry.start} — {entry.end}
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-text-dim">
              {entry.bullets.map((bullet) => (
                <li key={bullet} className="leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- experience-section.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: experience timeline section"
```

---

### Task 8: Projects grid + ProjectCard (flip interaction)

**Files:**
- Create: `components/project-card.tsx`, `components/sections/projects-section.tsx`
- Delete: `src/components/Cards/card.js`, `src/components/Cards/card.css`
- Test: `components/__tests__/project-card.test.tsx`

**Interfaces:**
- Consumes: `Project` type and `projects` from `lib/data/projects.ts` (Task 3).
- Produces: `<ProjectCard project={Project} />` (self-contained flip state, no props for active/onClick needed from the parent — simplification over the old CRA version, which lifted state to the parent unnecessarily), `<ProjectsSection />`.

- [ ] **Step 1: Write the failing test**

```tsx
// components/__tests__/project-card.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "../project-card";
import type { Project } from "@/lib/data/projects";

const project: Project = {
  title: "Test Project",
  stack: ["TypeScript"],
  desc: "A project for testing.",
  video: "/samples/Reactflow.mp4",
  thumbnail: "/thumbnail/Reactflow.png",
  link: "https://github.com/AbhinavJoe/test",
};

describe("ProjectCard", () => {
  it("shows the title and GitHub link by default", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", project.link);
  });

  it("flips to the demo video when 'Play Demo' is clicked, and back on 'Back to Details'", () => {
    render(<ProjectCard project={project} />);
    fireEvent.click(screen.getByRole("button", { name: /play demo/i }));
    expect(screen.getByRole("button", { name: /back to details/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /back to details/i }));
    expect(screen.getByRole("button", { name: /play demo/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- project-card.test.tsx`
Expected: FAIL — `project-card.tsx` doesn't exist yet.

- [ ] **Step 3: Write `components/project-card.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/data/projects";
import { cn } from "@/lib/cn";

export function ProjectCard({ project }: { project: Project }) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="relative h-[380px] w-full overflow-hidden rounded-xl border border-border bg-bg-raised">
      {showDemo ? (
        <div className="relative h-full w-full">
          <video className="h-full w-full object-cover" autoPlay loop muted playsInline>
            <source src={project.video} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={() => setShowDemo(false)}
            className={cn(
              "absolute bottom-3 right-3 rounded-md border border-border bg-bg px-3 py-1.5 text-sm font-medium text-text",
              "hover:border-accent hover:text-accent-strong"
            )}
          >
            Back to Details
          </button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.thumbnail} alt={`${project.title} thumbnail`} className="h-40 w-full object-cover" />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
            <h3 className="font-semibold text-text">{project.title}</h3>
            <p className="flex-1 text-sm text-text-dim">{project.desc}</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:border-accent hover:text-accent-strong"
              >
                Play Demo
              </button>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text hover:border-accent hover:text-accent-strong"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- project-card.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Write `components/sections/projects-section.tsx`**

```tsx
import { projects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/project-card";

export function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">Projects</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Delete the old CRA card component**

```bash
git rm src/components/Cards/card.js src/components/Cards/card.css
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: projects grid with self-contained flip-card interaction"
```

---

### Task 9: Contact section — form, socials, live GitHub repo list

**Files:**
- Create: `components/contact-form.tsx`, `components/socials.tsx`, `components/repo-list.tsx`, `components/sections/contact-section.tsx`
- Delete: `src/home/footer/` (entire directory, once ported)
- Test: `components/__tests__/repo-list.test.tsx`

**Interfaces:**
- Produces: `<ContactForm />`, `<Socials />`, `<RepoList />` (fetches `https://api.github.com/users/AbhinavJoe/repos` client-side, unchanged behavior per Global Constraints), `<ContactSection />`.

- [ ] **Step 1: Write the failing test**

```tsx
// components/__tests__/repo-list.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { RepoList } from "../repo-list";

const mockRepos = [
  {
    name: "z-repo",
    html_url: "https://github.com/AbhinavJoe/z-repo",
    description: "older",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    license: null,
  },
  {
    name: "a-repo",
    html_url: "https://github.com/AbhinavJoe/a-repo",
    description: "newer",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    license: { name: "MIT" },
  },
];

describe("RepoList", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockRepos),
    }) as jest.Mock;
  });

  it("fetches repos and sorts them by most-recently updated first", async () => {
    render(<RepoList />);
    await waitFor(() => expect(screen.getByText("a-repo")).toBeInTheDocument());
    const names = screen.getAllByRole("heading").map((el) => el.textContent);
    expect(names).toEqual(["a-repo", "z-repo"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- repo-list.test.tsx`
Expected: FAIL — `repo-list.tsx` doesn't exist yet.

- [ ] **Step 3: Write `components/repo-list.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

type Repo = {
  name: string;
  url: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  license: string;
};

export function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        const response = await fetch("https://api.github.com/users/AbhinavJoe/repos");
        const raw = await response.json();
        const formatted: Repo[] = raw
          .map((repo: any) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            license: repo.license?.name ?? "No License",
          }))
          .sort((a: Repo, b: Repo) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        if (!cancelled) setRepos(formatted);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    }

    fetchRepos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto rounded-xl border border-border">
      <div className="flex flex-col gap-2 p-3">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border p-3 hover:border-accent"
          >
            <h3 className="font-mono text-sm font-semibold text-text">{repo.name}</h3>
            <p className="text-xs text-text-dim">{repo.description ?? "No description"}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- repo-list.test.tsx`
Expected: PASS — 1 test passed.

- [ ] **Step 5: Write `components/socials.tsx`**

```tsx
import { Github, Linkedin } from "lucide-react";

export function Socials() {
  return (
    <div className="flex items-center justify-center gap-4 md:justify-start">
      <span className="text-sm text-text-dim">Find me on:</span>
      <a
        href="https://www.linkedin.com/in/abhinavjoe/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="text-text hover:text-accent-strong"
      >
        <Linkedin size={22} />
      </a>
      <a
        href="https://github.com/abhinavjoe"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="text-text hover:text-accent-strong"
      >
        <Github size={22} />
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Write `components/contact-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    // Behavior unchanged from the previous form — wiring to an actual
    // submit endpoint is out of scope for this revamp (spec §9).
    setTimeout(() => setStatus("sent"), 600);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm text-text-dim">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="rounded-md border border-border bg-bg-raised px-3 py-2 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-text-dim">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-md border border-border bg-bg-raised px-3 py-2 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm text-text-dim">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="rounded-md border border-border bg-bg-raised px-3 py-2 text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
      </div>
      <Button type="submit" disabled={status === "submitting"}>
        {status === "sent" ? "Sent" : status === "submitting" ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 7: Write `components/sections/contact-section.tsx`**

```tsx
import { ContactForm } from "@/components/contact-form";
import { Socials } from "@/components/socials";
import { RepoList } from "@/components/repo-list";

export function ContactSection() {
  return (
    <footer id="contact" className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20 md:flex-row">
      <div className="flex flex-1 flex-col justify-between gap-8">
        <ContactForm />
        <Socials />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <h2 className="font-mono text-sm uppercase tracking-wide text-teal">GitHub Repositories</h2>
        <div className="h-80">
          <RepoList />
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Delete the old CRA footer directory**

```bash
git rm -r src/home/footer
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: contact section with form, socials, and live GitHub repo list"
```

---

### Task 10: Compose the home page, remove remaining CRA source, verify build

**Files:**
- Modify: `app/page.tsx`
- Delete: `src/home/`, `src/App.js` remnants (if any remain), `src/styles/`, `src/setupTests.js` references
- Test: `app/__tests__/page.test.tsx`

**Interfaces:**
- Produces: `HomePage` default export composing Hero, About, Skills, Experience, Projects, (blog preview added in Task 15), Contact in order.

- [ ] **Step 1: Write the failing test**

```tsx
// app/__tests__/page.test.tsx
import { render } from "@testing-library/react";
import HomePage from "../page";

describe("HomePage", () => {
  it("renders every section in document order", () => {
    const { container } = render(<HomePage />);
    const ids = ["hero", "about", "skills", "experience", "projects", "contact"];
    const renderedIds = Array.from(container.querySelectorAll("[id]"))
      .map((el) => el.id)
      .filter((id) => ids.includes(id));
    expect(renderedIds).toEqual(ids);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- page.test.tsx`
Expected: FAIL — `app/page.tsx` still renders the Task 1 placeholder.

- [ ] **Step 3: Write `app/page.tsx`**

```tsx
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Remove remaining CRA source directories**

```bash
git rm -r src/home src/styles
```

Leave `src/components` only if anything still references it (it shouldn't after Task 8); confirm with `git status` and remove the empty `src/` tree if nothing remains.

- [ ] **Step 6: Full verification**

Run: `npm run build`
Expected: build succeeds, `/` prerenders.

Run: `npm run dev`, open `http://localhost:3000`
Expected: all six sections render top-to-bottom, dark/light toggle (via OS setting) shows both palettes correctly, no console errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: compose home page from all sections; remove remaining CRA source"
```

---

### Task 11: `lib/blog.ts` — MDX loading, parsing, reading time

**Files:**
- Create: `lib/blog.ts`
- Test: `lib/__tests__/blog.test.ts`

**Interfaces:**
- Produces:
  - `type BlogPost = { slug: string; title: string; date: string; tags: string[]; company: string; role: string; excerpt: string; readingTime: string; content: string }`
  - `getAllPosts(): BlogPost[]` — sorted newest-first by `date`
  - `getPostBySlug(slug: string): BlogPost | null`
  - `getAllTags(): string[]`

- [ ] **Step 1: Install MDX/parsing deps**

```bash
npm install gray-matter next-mdx-remote reading-time
```

- [ ] **Step 2: Create the content directory and move the drafts in**

```bash
mkdir -p content/blog
git mv blog-draft-analytics-microservice-di.mdx content/blog/analytics-microservice-di.mdx
git mv blog-draft-auth-microservice-migration.mdx content/blog/auth-microservice-migration.mdx
git mv blog-draft-clms-frontend-leadership.mdx content/blog/clms-frontend-leadership.mdx
git mv blog-draft-document-comparison-syncfusion.mdx content/blog/document-comparison-syncfusion.mdx
git mv blog-draft-nl-to-mongodb-chat-pipeline.mdx content/blog/nl-to-mongodb-chat-pipeline.mdx
git mv blog-draft-task-pipeline-taskiq-nats.mdx content/blog/task-pipeline-taskiq-nats.mdx
```

- [ ] **Step 3: Write the failing test**

```ts
// lib/__tests__/blog.test.ts
import { getAllPosts, getPostBySlug, getAllTags } from "../blog";

describe("blog content loader", () => {
  it("loads all six posts, newest first", () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(6);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i].date).getTime());
    }
  });

  it("parses required frontmatter fields", () => {
    const post = getPostBySlug("auth-microservice-migration");
    expect(post).not.toBeNull();
    expect(post?.title).toBe("Pulling Auth Out of the Monolith");
    expect(post?.tags).toContain("keycloak");
    expect(post?.company).toBe("Panaroma Intelligence Solutions");
  });

  it("computes a human-readable reading time", () => {
    const post = getPostBySlug("auth-microservice-migration");
    expect(post?.readingTime).toMatch(/\d+ min read/);
  });

  it("returns null for an unknown slug", () => {
    expect(getPostBySlug("does-not-exist")).toBeNull();
  });

  it("collects the union of all tags across posts", () => {
    const tags = getAllTags();
    expect(tags).toEqual(expect.arrayContaining(["fastapi", "keycloak", "redis"]));
    expect(new Set(tags).size).toBe(tags.length); // deduped
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm run test -- blog.test.ts`
Expected: FAIL — `lib/blog.ts` doesn't exist yet.

- [ ] **Step 5: Write `lib/blog.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  company: string;
  role: string;
  excerpt: string;
  readingTime: string;
  content: string;
};

function loadPost(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug: data.slug,
    title: data.title,
    date: data.date,
    tags: data.tags ?? [],
    company: data.company,
    role: data.role,
    excerpt: data.excerpt,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map(loadPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

export function getAllTags(): string[] {
  const tags = getAllPosts().flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm run test -- blog.test.ts`
Expected: PASS — 5 tests passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: blog content loader (frontmatter parsing, reading time, tags)"
```

---

### Task 12: MDX rendering components (code blocks, Mermaid)

**Files:**
- Create: `components/blog/mdx-components.tsx`, `components/blog/mermaid-diagram.tsx`
- Test: `components/blog/__tests__/mermaid-diagram.test.tsx`

**Interfaces:**
- Produces: `mdxComponents: Record<string, React.ComponentType<any>>` (passed to `MDXRemote`'s `components` prop), `<MermaidDiagram chart={string} />`.

- [ ] **Step 1: Install mermaid**

```bash
npm install mermaid
```

- [ ] **Step 2: Write the failing test**

```tsx
// components/blog/__tests__/mermaid-diagram.test.tsx
import { render, screen } from "@testing-library/react";
import { MermaidDiagram } from "../mermaid-diagram";

jest.mock("mermaid", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: jest.fn().mockResolvedValue({ svg: "<svg data-testid='mermaid-svg'></svg>" }),
  },
}));

describe("MermaidDiagram", () => {
  it("renders a container that mermaid can mount into", () => {
    render(<MermaidDiagram chart="graph TD; A-->B;" />);
    expect(screen.getByTestId("mermaid-container")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test -- mermaid-diagram.test.tsx`
Expected: FAIL — `mermaid-diagram.tsx` doesn't exist yet.

- [ ] **Step 4: Write `components/blog/mermaid-diagram.tsx`**

```tsx
"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";

let initialized = false;

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({ startOnLoad: false, theme: "dark" });
      initialized = true;
    }
    let cancelled = false;
    mermaid.render(`mermaid-${id}`, chart).then(({ svg: rendered }) => {
      if (!cancelled) setSvg(rendered);
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      data-testid="mermaid-container"
      className="my-6 overflow-x-auto rounded-lg border border-border bg-bg-raised p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- mermaid-diagram.test.tsx`
Expected: PASS — 1 test passed.

- [ ] **Step 6: Write `components/blog/mdx-components.tsx`**

```tsx
import type { MDXComponents } from "mdx/types";
import { MermaidDiagram } from "./mermaid-diagram";

function CodeBlock(props: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-bg-raised p-4 font-mono text-sm" {...props} />
  );
}

export const mdxComponents: MDXComponents = {
  pre: (props: any) => {
    const codeChild = props.children;
    const className: string = codeChild?.props?.className ?? "";
    if (className.includes("language-mermaid")) {
      return <MermaidDiagram chart={String(codeChild.props.children).trim()} />;
    }
    return <CodeBlock {...props} />;
  },
  h2: (props: any) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-text" {...props} />,
  h3: (props: any) => <h3 className="mt-8 mb-3 text-xl font-semibold text-text" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed text-text-dim" {...props} />,
  ul: (props: any) => <ul className="mb-4 list-disc pl-6 text-text-dim" {...props} />,
  a: (props: any) => <a className="text-accent-strong underline underline-offset-2" {...props} />,
};
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: MDX renderers for code blocks and mermaid diagrams"
```

---

### Task 13: `/blog` list page + tag filter

**Files:**
- Create: `app/blog/page.tsx`, `components/blog/post-card.tsx`, `components/blog/tag-filter.tsx`
- Test: `components/blog/__tests__/tag-filter.test.tsx`

**Interfaces:**
- Consumes: `getAllPosts`, `getAllTags` from `lib/blog.ts` (Task 11).
- Produces: `<PostCard post={BlogPost} />`, `<TagFilter tags={string[]} activeTag={string | null} onSelect={(tag: string | null) => void} />`.

- [ ] **Step 1: Write the failing test**

```tsx
// components/blog/__tests__/tag-filter.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { TagFilter } from "../tag-filter";

describe("TagFilter", () => {
  it("calls onSelect with the clicked tag, and with null for 'All'", () => {
    const onSelect = jest.fn();
    render(<TagFilter tags={["fastapi", "redis"]} activeTag={null} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "fastapi" }));
    expect(onSelect).toHaveBeenCalledWith("fastapi");

    fireEvent.click(screen.getByRole("button", { name: /all/i }));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("marks the active tag with aria-pressed", () => {
    render(<TagFilter tags={["fastapi", "redis"]} activeTag="redis" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "redis" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "fastapi" })).toHaveAttribute("aria-pressed", "false");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tag-filter.test.tsx`
Expected: FAIL — `tag-filter.tsx` doesn't exist yet.

- [ ] **Step 3: Write `components/blog/tag-filter.tsx`**

```tsx
"use client";

import { cn } from "@/lib/cn";

export function TagFilter({
  tags,
  activeTag,
  onSelect,
}: {
  tags: string[];
  activeTag: string | null;
  onSelect: (tag: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={activeTag === null}
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full border px-3 py-1 font-mono text-xs",
          activeTag === null ? "border-accent text-accent-strong" : "border-border text-text-dim"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          aria-pressed={activeTag === tag}
          onClick={() => onSelect(tag)}
          className={cn(
            "rounded-full border px-3 py-1 font-mono text-xs",
            activeTag === tag ? "border-accent text-accent-strong" : "border-border text-text-dim"
          )}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- tag-filter.test.tsx`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Write `components/blog/post-card.tsx`**

```tsx
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/lib/blog";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-bg-raised p-6 transition-colors hover:border-accent"
    >
      <span className="font-mono text-xs text-text-dim">
        {post.date} · {post.readingTime}
      </span>
      <h3 className="text-lg font-semibold text-text">{post.title}</h3>
      <p className="text-sm text-text-dim">{post.excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 6: Write `app/blog/page.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/blog/post-card";
import { TagFilter } from "@/components/blog/tag-filter";
import type { BlogPost } from "@/lib/blog";

export function BlogListClient({ posts, tags }: { posts: BlogPost[]; tags: string[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(
    () => (activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts),
    [posts, activeTag]
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="mb-4 text-3xl font-bold text-text">Blog</h1>
      <p className="mb-8 max-w-prose text-text-dim">
        Notes from building production systems — auth, task queues, LLM pipelines, and the
        occasional frontend.
      </p>
      <div className="mb-10">
        <TagFilter tags={tags} activeTag={activeTag} onSelect={setActiveTag} />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Write the server entry `app/blog/page.tsx` wrapper**

Rename the file above to `app/blog/blog-list-client.tsx`, and write `app/blog/page.tsx` as the actual route (a server component that reads posts at build time and hands them to the client component for interactivity):

```tsx
// app/blog/page.tsx
import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogListClient } from "./blog-list-client";

export const metadata = { title: "Blog — Abhinav Joshi" };

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return <BlogListClient posts={posts} tags={tags} />;
}
```

- [ ] **Step 8: Verify the build**

Run: `npm run build`
Expected: `/blog` prerenders with all 6 posts.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: blog list page with tag filtering"
```

---

### Task 14: `/blog/[slug]` post detail page

**Files:**
- Create: `app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts`, `getPostBySlug` from `lib/blog.ts`; `mdxComponents` from Task 12.
- Produces: statically generated post routes via `generateStaticParams`.

- [ ] **Step 1: Write `app/blog/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

// Next.js 15: route `params` is a Promise in Server Components — must be awaited.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: `${post.title} — Abhinav Joshi`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="mb-8 inline-block text-sm text-accent-strong">
        ← Back to blog
      </Link>
      <span className="font-mono text-xs text-text-dim">
        {post.date} · {post.readingTime} · {post.company}
      </span>
      <h1 className="mt-2 mb-8 text-3xl font-bold text-text md:text-4xl">{post.title}</h1>
      <div className="prose-invert">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify the build generates all six post routes**

Run: `npm run build`
Expected: build output lists `/blog/[slug]` as SSG with 6 generated paths (`analytics-microservice-di`, `auth-microservice-migration`, `clms-frontend-leadership`, `document-comparison-syncfusion`, `nl-to-mongodb-chat-pipeline`, `task-pipeline-taskiq-nats`).

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `http://localhost:3000/blog/task-pipeline-taskiq-nats`
Expected: post renders with headings, code blocks, and the mermaid diagram rendering as an SVG (this post's draft includes a ```mermaid fence — confirm it renders, not just prints as text).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: blog post detail page with static generation"
```

---

### Task 15: Blog preview section on the home page

**Files:**
- Create: `components/sections/blog-preview-section.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts` from `lib/blog.ts`.
- Produces: `<BlogPreviewSection posts={BlogPost[]} />`.

- [ ] **Step 1: Write `components/sections/blog-preview-section.tsx`**

```tsx
import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import type { BlogPost } from "@/lib/blog";

export function BlogPreviewSection({ posts }: { posts: BlogPost[] }) {
  const latest = posts.slice(0, 3);

  return (
    <section id="blog-preview" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wide text-teal">From the blog</h2>
        <Link href="/blog" className="text-sm text-accent-strong hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {latest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire it into `app/page.tsx`**

```tsx
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { BlogPreviewSection } from "@/components/sections/blog-preview-section";
import { ContactSection } from "@/components/sections/contact-section";
import { getAllPosts } from "@/lib/blog";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <BlogPreviewSection posts={posts} />
      <ContactSection />
    </main>
  );
}
```

- [ ] **Step 3: Update the Task 10 page-order test to include `blog-preview`**

In `app/__tests__/page.test.tsx`, update the `ids` array inside the test:

```ts
const ids = ["hero", "about", "skills", "experience", "projects", "blog-preview", "contact"];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Verify the build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: blog preview section on the home page"
```

---

### Task 16: Motion hooks + Reveal wrapper, applied across sections

**Files:**
- Create: `lib/hooks/use-prefers-reduced-motion.ts`, `lib/hooks/use-can-render-3d.ts`, `components/layout/reveal.tsx`
- Modify: `components/sections/about-section.tsx`, `skills-section.tsx`, `projects-section.tsx`, `blog-preview-section.tsx` (wrap content in `<Reveal>`)
- Test: `lib/hooks/__tests__/use-prefers-reduced-motion.test.ts`

**Interfaces:**
- Produces: `usePrefersReducedMotion(): boolean`, `useCanRender3D(): boolean` (viewport width ≥ 768px AND `WebGLRenderingContext` available AND not reduced-motion), `<Reveal>{children}</Reveal>` (Framer Motion fade+slide-up on scroll into view, no-op if reduced motion).

- [ ] **Step 1: Write the failing test**

```ts
// lib/hooks/__tests__/use-prefers-reduced-motion.test.ts
import { renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "../use-prefers-reduced-motion";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

describe("usePrefersReducedMotion", () => {
  it("returns true when the OS prefers reduced motion", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("returns false otherwise", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- use-prefers-reduced-motion.test.ts`
Expected: FAIL — hook doesn't exist yet.

- [ ] **Step 3: Write `lib/hooks/use-prefers-reduced-motion.ts`**

```ts
import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(query.matches);

    const listener = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return prefersReduced;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- use-prefers-reduced-motion.test.ts`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Write `lib/hooks/use-can-render-3d.ts`**

```ts
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function useCanRender3D(): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCanRender(false);
      return;
    }
    const isWideEnough = window.innerWidth >= 768;
    setCanRender(isWideEnough && detectWebGL());
  }, [prefersReducedMotion]);

  return canRender;
}
```

- [ ] **Step 6: Write `components/layout/reveal.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

export function Reveal({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 7: Wrap section content in `<Reveal>`**

In `about-section.tsx`, `skills-section.tsx`, `projects-section.tsx`, `blog-preview-section.tsx`: wrap the inner content (everything after the `<h2>`, or the whole section body) in `<Reveal>...</Reveal>`. Example for `about-section.tsx`:

```tsx
import { Reveal } from "@/components/layout/reveal";

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-6 font-mono text-sm uppercase tracking-wide text-teal">About</h2>
      <Reveal>
        <p className="text-lg leading-relaxed text-text-dim">{/* unchanged copy */}</p>
      </Reveal>
    </section>
  );
}
```

Apply the same pattern (import `Reveal`, wrap the content below the heading) to `skills-section.tsx`, `projects-section.tsx`, and `blog-preview-section.tsx`.

- [ ] **Step 8: Verify the build and manually check reduced motion**

Run: `npm run build` — expect success.
Manually: in Chrome DevTools, emulate `prefers-reduced-motion: reduce`, reload `http://localhost:3000`, confirm sections appear immediately with no fade/slide.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: reduced-motion-aware scroll reveals across sections"
```

---

### Task 17: 3D hero scene (react-three-fiber) with fallback

**Files:**
- Create: `components/sections/hero-scene.tsx`, `components/sections/hero-scene-fallback.tsx`
- Modify: `components/sections/hero-section.tsx`
- Test: `components/sections/__tests__/hero-section-3d.test.tsx`

**Interfaces:**
- Consumes: `useCanRender3D` from Task 16.
- Produces: `<HeroScene />` (client component, r3f Canvas), `<HeroSceneFallback />` (static gradient div), both mounted from `hero-section.tsx` behind the capability check.

- [ ] **Step 1: Install three.js deps**

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

- [ ] **Step 2: Write `components/sections/hero-scene-fallback.tsx`**

```tsx
export function HeroSceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,_var(--accent)_0%,_transparent_60%)] opacity-20"
    />
  );
}
```

- [ ] **Step 3: Write `components/sections/hero-scene.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Icosahedron } from "@react-three/drei";
import type { Mesh } from "three";

function WireframeCore() {
  const meshRef = useRef<Mesh>(null);
  const scrollProgress = useRef(0);

  useFrame((_, delta) => {
    if (typeof window !== "undefined") {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      scrollProgress.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
      meshRef.current.rotation.x = scrollProgress.current * Math.PI * 0.5;
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[1.6, 1]}>
      <meshBasicMaterial color="#8b7cf6" wireframe />
    </Icosahedron>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="absolute inset-0 -z-10"
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <WireframeCore />
      <Sparkles count={80} scale={6} size={2} speed={0.3} color="#5fe3c4" />
    </Canvas>
  );
}
```

- [ ] **Step 4: Write the failing test for the capability gate**

```tsx
// components/sections/__tests__/hero-section-3d.test.tsx
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../hero-section";

jest.mock("@/lib/hooks/use-can-render-3d", () => ({
  useCanRender3D: jest.fn(),
}));

jest.mock("../hero-scene", () => ({ HeroScene: () => <div data-testid="hero-scene-3d" /> }));
jest.mock("../hero-scene-fallback", () => ({
  HeroSceneFallback: () => <div data-testid="hero-scene-fallback" />,
}));

import { useCanRender3D } from "@/lib/hooks/use-can-render-3d";

describe("HeroSection 3D gating", () => {
  it("renders the 3D scene when the capability check passes", () => {
    (useCanRender3D as jest.Mock).mockReturnValue(true);
    render(<HeroSection />);
    expect(screen.getByTestId("hero-scene-3d")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-scene-fallback")).not.toBeInTheDocument();
  });

  it("renders the static fallback when it doesn't", () => {
    (useCanRender3D as jest.Mock).mockReturnValue(false);
    render(<HeroSection />);
    expect(screen.getByTestId("hero-scene-fallback")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-scene-3d")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm run test -- hero-section-3d.test.tsx`
Expected: FAIL — `hero-section.tsx` doesn't gate on `useCanRender3D` yet.

- [ ] **Step 6: Update `components/sections/hero-section.tsx` to gate on capability**

Add `"use client"` at the top (required now, since it calls a hook), and wire in a dynamic import for `HeroScene` (WebGL code must never run during SSR):

```tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { useCanRender3D } from "@/lib/hooks/use-can-render-3d";
import { HeroSceneFallback } from "./hero-scene-fallback";

const HeroScene = dynamic(() => import("./hero-scene").then((mod) => mod.HeroScene), { ssr: false });

export function HeroSection() {
  const canRender3D = useCanRender3D();

  return (
    <section id="hero" className="relative mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 overflow-hidden px-6 py-24 md:flex-row md:py-32">
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
```

> Task 5's original `hero-section.test.tsx` renders `<HeroSection />` directly (no mocks) — with `"use client"` added, that test still runs fine under Jest's jsdom environment, but `useCanRender3D` will evaluate `detectWebGL()` against jsdom's canvas stub and return `false`, so it'll hit the fallback branch. That's fine; Task 5's assertions (name, role, alt text) don't depend on which hero variant renders.

- [ ] **Step 7: Run test to verify it passes**

Run: `npm run test -- hero-section-3d.test.tsx`
Expected: PASS — 2 tests passed.

Run: `npm run test -- hero-section.test.tsx`
Expected: still PASS (Task 5's tests are unaffected by the gating).

- [ ] **Step 8: Verify the build and manual check**

Run: `npm run build`
Expected: success — `HeroScene`'s dynamic import with `ssr: false` must not break static generation of `/`.

Run: `npm run dev`, open `http://localhost:3000` at a width ≥768px
Expected: wireframe icosahedron + teal sparkles visible behind the hero text, rotating; scrolling the page tilts it. Resize the viewport below 768px (or use DevTools device emulation) and reload — expect the static gradient fallback instead.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: react-three-fiber hero scene with capability-gated fallback"
```

---

### Task 18: GSAP ScrollTrigger pinned Experience timeline

**Files:**
- Modify: `components/sections/experience-section.tsx`
- Test: manual only (GSAP's scroll-linked DOM mutation isn't meaningfully unit-testable in jsdom — see Step 4)

**Interfaces:**
- Consumes: `data-experience-item` attribute added in Task 7; `usePrefersReducedMotion` from Task 16.

- [ ] **Step 1: Install GSAP**

```bash
npm install gsap
```

- [ ] **Step 2: Update `components/sections/experience-section.tsx` to pin and stagger-reveal entries on scroll**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "@/lib/data/experience";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const items = sectionRef.current.querySelectorAll("[data-experience-item]");
    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: item, start: "top 80%" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="experience" ref={sectionRef} className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="mb-10 font-mono text-sm uppercase tracking-wide text-teal">Experience</h2>
      <div className="flex flex-col gap-16">
        {experience.map((entry) => (
          <article key={entry.company} data-experience-item className="border-l-2 border-border pl-6">
            <h3 className="text-xl font-semibold text-text">{entry.company}</h3>
            <p className="text-sm text-text-dim">
              {entry.role} · {entry.start} — {entry.end}
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-text-dim">
              {entry.bullets.map((bullet) => (
                <li key={bullet} className="leading-relaxed">
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```

> This uses a per-item scroll-triggered reveal (staggered by natural scroll position) rather than a hard pin-and-scrub, which is the safer choice for a two-entry timeline — a full pin would leave awkward empty scroll distance with only two roles. If a third role is added later and a true pinned/scrubbed timeline becomes worth the complexity, revisit then.

- [ ] **Step 3: Re-run Task 7's existing test**

Run: `npm run test -- experience-section.test.tsx`
Expected: PASS — GSAP's `ScrollTrigger` doesn't fire meaningfully under jsdom (no real layout/scroll), so both roles and all bullets are already in the DOM (just at `opacity: 0` via the animation's initial state, which doesn't affect `getByText` queries); the existing assertions are unaffected.

- [ ] **Step 4: Manual verification (this is the real test for this task)**

Run: `npm run dev`, open `http://localhost:3000/#experience`, scroll slowly through the section.
Expected: each experience card fades and slides in from the left as it enters the viewport; with `prefers-reduced-motion: reduce` emulated in DevTools, both cards are simply present with no animation.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: GSAP scroll-triggered reveal for the experience timeline"
```

---

### Task 19: QA pass, CRA cleanup sweep, final verification

**Files:**
- Modify: `README.md`
- Delete: any remaining CRA leftovers found during the sweep (e.g. leftover `src/` directory if empty, `public/manifest.json` if it still references CRA-specific icons, `public/logo192.png` if unused)

**Interfaces:** none (verification-only task).

- [ ] **Step 1: Sweep for leftover CRA references**

```bash
grep -ril "react-scripts\|CRACO\|create-react-app" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git
```

Expected: no matches outside this plan document and the spec (which reference it historically). Remove/update anything that does.

- [ ] **Step 2: Confirm `src/` is gone or empty**

```bash
ls src 2>/dev/null || echo "src/ removed"
```

If anything remains in `src/`, confirm it's still referenced from `app/` or `components/`; if not, delete it.

- [ ] **Step 3: Full test suite**

Run: `npm run test`
Expected: all tests across all 19 tasks pass.

- [ ] **Step 4: Full build**

Run: `npm run build`
Expected: success, with `/`, `/blog`, and all 6 `/blog/[slug]` routes statically generated.

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: no errors (warnings acceptable, note any for follow-up).

- [ ] **Step 6: Manual QA checklist**

Run: `npm run dev`, and check:
- 375px viewport width (DevTools device toolbar): no horizontal scroll, all sections readable, hero falls back to the static gradient.
- Landscape orientation on a mobile emulation: layout holds.
- `prefers-reduced-motion: reduce` emulated: no 3D scene, no GSAP animation, no Framer Motion fade — content just present.
- Toggle OS light/dark mode (or use `data-theme` override if a toggle UI exists): both palettes readable, no color declared only inside one mode's block (spot-check `app/globals.css` against Task 2's token block).
- Tab through the page with keyboard only: nav links, project card buttons, tag filter buttons, and the contact form all reachable with a visible focus ring.
- `/blog` tag filter narrows the grid correctly; `/blog/[slug]` back-link returns to `/blog`.

- [ ] **Step 7: Update `README.md`**

Replace the CRA-generated boilerplate README with a short project description reflecting the new stack:

```markdown
# Abhinav Joshi — Portfolio

Personal portfolio and technical blog, built with Next.js 15 (App Router),
TypeScript, Tailwind CSS, Framer Motion, GSAP, and react-three-fiber.

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

## Testing

\`\`\`bash
npm run test
\`\`\`

## Blog

Posts live as MDX files under \`content/blog/\`. Frontmatter schema:

\`\`\`yaml
title: string
slug: string
date: "YYYY-MM-DD"
tags: string[]
company: string
role: string
excerpt: string
\`\`\`
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: final QA pass, CRA cleanup sweep, updated README"
```

---

## Post-Plan Notes

- Deploying to Vercel: the existing Vercel project is already wired to this repo/branch (per the spec, hosting is unchanged) — a normal `git push` (only when Abhinav asks for it, per Global Constraints) triggers the redeploy; no Vercel config changes are anticipated since Next.js is Vercel's first-class framework.
- The KubeCentrix project card (Task 3) uses placeholder media reused from another project — revisit if real assets become available.
- The optional 7th blog post (InvoLead/RAG internship) was not produced — `lib/blog.ts` (Task 11) requires no changes to support it later; just add a seventh `.mdx` file to `content/blog/`.
