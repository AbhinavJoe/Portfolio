# Portfolio Revamp: Next.js Rebuild, Blog Section, 3D/Scroll Experience

Date: 2026-08-21
Status: Approved (pending spec self-review)
Owner: Abhinav Joshi

## 1. Summary

Rebuild `abhinavjoe.vercel.app` from a static Create React App SPA into a
Next.js 15 (App Router, TypeScript) site with:

- A refreshed visual system (dark-first, technical-minimalist) replacing the
  current flat-lilac neubrutalist look.
- A real WebGL 3D hero (react-three-fiber) plus scroll-driven motion
  (Framer Motion + GSAP ScrollTrigger + Lenis) across the page, with a
  reduced-motion and low-end-mobile fallback.
- Content refreshed to match the resume: an Experience section (currently
  absent), updated Skills, an added KubeCentrix project card, refreshed bio.
- A new `/blog` section rendering MDX posts statically generated at build
  time. Six posts already exist at the project root
  (`blog-draft-*.mdx`, produced by a companion prompt kit — see §7)
  and are ready to be moved into the content directory.

## 2. Current State (for reference)

- CRA (`react-scripts`) SPA, no router, single page (`src/home/home.js`
  composes header/main/footer).
- Tailwind, but no design tokens — hardcoded `#d6bcfa` background, ad hoc
  black-border/box-shadow "neubrutalist" buttons and inputs
  (`src/styles/index.css`).
- Content is stale versus the resume: no Experience section, generic bio,
  Skills list omits AWS/Docker/Keycloak/FastAPI/etc., Projects grid is
  missing KubeCentrix (the hackathon-winning project).
- `Repo` component (`src/home/footer/repo.js`) live-fetches
  `api.github.com/users/AbhinavJoe/repos` client-side — keep this behavior,
  it already works and needs no redesign beyond restyling.
- `Card` component (`src/components/Cards/card.js`) has a flip interaction
  (thumbnail → autoplaying demo video) — keep the interaction, restyle it.

## 3. Architecture

**Stack migration**: CRA → Next.js 15, App Router, TypeScript. Tailwind +
shadcn/ui for the component layer. Deploys to Vercel (unchanged host).

**Routing**:
- `/` — the single-page portfolio (hero, about, skills, experience,
  projects, blog preview, contact/footer), same one-page-scroll feel as
  today but as sections within the App Router home route rather than a
  hand-assembled `home.js`.
- `/blog` — post list (card grid, tag filter, reading time).
- `/blog/[slug]` — individual post, statically generated
  (`generateStaticParams`) from MDX front matter.

**Content pipeline**: MDX files live at `content/blog/*.mdx`. Front matter
schema (already produced by the six existing drafts):

```yaml
title: string
slug: string           # matches filename
date: "YYYY-MM-DD"
tags: string[]
company: string
role: string
excerpt: string
```

A small loader (`lib/blog.ts`) reads `content/blog/*.mdx` at build time,
parses front matter with `gray-matter`, and renders body MDX with
`next-mdx-remote` or `@next/mdx` (final pick left to implementation) —
support fenced ```mermaid blocks (all six drafts use them) via a rehype/
remark mermaid plugin, and standard syntax highlighting for code fences.

**Data that stays client-fetched**: the GitHub repo list keeps its current
runtime `fetch` to the GitHub API (no build-time coupling to GitHub's rate
limits); everything else (bio, skills, experience, projects, blog posts) is
static content shipped in the repo.

## 4. Visual System

Design tokens, hand-picked — **not derived from the profile photo or any
other image**, so a future photo swap never requires a palette change:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a0b10` | page background |
| `--bg-raised` | `#12141c` | cards, raised surfaces |
| `--text` | `#e7e9f0` | primary text |
| `--text-dim` | `#9aa1b5` | secondary text |
| `--accent` | `#8b7cf6` | primary accent (violet — evolves the current purple brand rather than discarding it) |
| `--accent-strong` | `#b7abff` | accent hover/emphasis |
| `--teal` | `#5fe3c4` | secondary accent, used sparingly (tags, highlights) |

Both a dark and light palette are defined as CSS custom properties per the
standard `:root` / `prefers-color-scheme` / `[data-theme]` token pattern,
dark-first (light mode is the override, not the default assumption), with
a toggle. All colors resolve through tokens — no raw hex in components.

**Typography**: `IBM Plex Sans` (display/body) + `IBM Plex Mono` (labels,
tags, code) — a coherent developer-tool superfamily, loaded via Google
Fonts.

**Photo treatment**: the profile image sits in a fixed-aspect-ratio
container (`object-fit: cover`) with a border/glow drawn from the
`--accent` token — never a duotone, color-extraction, or tint derived from
the image's own colors. Swapping the photo file is the only step needed to
update it; no palette rework.

**Motion**:
- Framer Motion — section entrance reveals, hover/press micro-interactions.
- GSAP ScrollTrigger — the pinned/staged Experience timeline scroll.
- Lenis — smooth scroll for the whole page.
- `prefers-reduced-motion` disables/simplifies all of the above; this is
  tested, not assumed.

**3D hero**: react-three-fiber + drei. An abstract wireframe/particle
structure (evoking "systems/architecture," not a generic spinning
primitive) that reacts to scroll position and pointer movement. Below a
capability/viewport threshold (small viewport, or a lightweight device
check), the scene is replaced by a static gradient plus the same 2D scroll
animations used elsewhere on the page — no WebGL shipped to devices that
can't afford it.

## 5. Pages / Components

**Home (`/`)**, top to bottom:
1. Hero — 3D scene, name, role, one-line pitch, CTA.
2. About — refreshed bio.
3. Skills — grouped by resume category (Languages, Frameworks/Development,
   Infra/DevOps, Data), replacing the current flat `SkillBar` list.
4. Experience — new section. Timeline: Panaroma Intelligence Solutions
   (Software Engineer, Feb 2025–present) and InvoLead Services (Software
   Developer Intern, May–Jul 2024), bullet highlights per the resume.
5. Projects — existing grid (Reactflow-X-DAG, FinCentrix, Google Search
   Automation, RAG-X-Langchain-JS) plus KubeCentrix (added). Flip-card /
   video-demo interaction kept, restyled to the new token system.
6. Blog preview — latest 3 posts, links to `/blog`.
7. Contact/footer — form, socials, live GitHub repo list (kept as-is
   functionally, restyled).

**Blog (`/blog`)**: card grid over all posts, tag filter, computed reading
time.

**Blog post (`/blog/[slug]`)**: rendered MDX, syntax-highlighted code,
mermaid diagrams, back link to `/blog`.

## 6. Error Handling & Edge Cases

- Missing/malformed MDX front matter at build time fails the build loudly
  (not a silent blank post) — this is a personal site with six known-good
  posts, so a hard failure is preferable to publishing broken content.
- GitHub repo fetch failure (rate limit, network) — keep existing
  `try/catch` behavior; render an empty/graceful state rather than crashing
  the footer.
- WebGL unavailable/unsupported — feature-detect and fall back to the
  static-gradient hero rather than erroring.
- Contact form — out of scope for this revamp beyond restyling; behavior
  unchanged.

## 7. Blog Content Pipeline (context, already executed)

A companion prompt kit (delivered separately, not part of this repo) was
used to generate the six posts now sitting at the project root as
`blog-draft-*.mdx`. Each prompt instructed Claude Code, run inside the
relevant work repo, to ground the post in real code/git history, sanitize
secrets/client names/proprietary logic, and emit MDX matching the schema
in §3. All six are present and schema-valid as of this spec. Implementation
work is: move them into `content/blog/`, verify each renders (including
mermaid fences), and wire them into the blog list/detail routes. No further
content generation is in scope here.

## 8. Testing

- Lighthouse (performance + accessibility) on both the full 3D hero and
  the degraded-mobile path.
- Manual check at 375px width and landscape orientation.
- `prefers-reduced-motion` verified end-to-end (3D scene, GSAP, Framer
  Motion all respect it).
- Keyboard navigation through blog cards, project cards, and the contact
  form; focus states visible against the new dark palette.
- Color contrast checked independently for both light and dark tokens
  (not assumed from one mode).

## 9. Out of Scope

- CMS/authoring UI for future posts (MDX files in-repo is the whole
  pipeline for now).
- Generating additional blog posts beyond the six already produced.
- Contact form backend changes.
- Analytics/SEO beyond what Next.js static generation gives for free.
