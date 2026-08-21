"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

// One marker slot per simultaneous target the busiest stage needs (Skills'
// four column headers). Reused for every other stage, where unused slots
// collapse to zero scale.
const MARKER_SLOTS = 4;

const UNDERLINE_HEIGHT = 3;
const UNDERLINE_GAP = 4; // px below the text baseline
const CIRCLE_PADDING = 10; // extra radius around an icon's own bounds

// The primary marker (slot 0) shrinks to this size while riding the rail
// between stages.
const DOT_DIAMETER = 10;

// The primary marker's transit between stages has three phases: retract
// from its resting shape into a dot on the rail, travel down the rail, then
// extend from a dot into the next stage's resting shape. Must sum to 1.
const PHASE_RETRACT = 0.25;
const PHASE_TRAVEL = 0.5;
const PHASE_EXTEND = 0.25;

// The rail sits a little left of the widest section container's (max-w-5xl
// = 64rem, so half-width 32rem) own left edge when centered, collapsing to
// a small fixed margin once the viewport gets too narrow for that gap to
// make sense. Mirrors the visible rail element's own CSS `left`.
const REM = 16; // assumed root font-size — this project never overrides it
function getRailX(): number {
  return Math.max(REM, window.innerWidth / 2 - 33.5 * REM);
}

// A stage (after the first) counts as "arrived" once its target's top has
// scrolled to this many px below the top of the viewport — a fixed offset
// rather than a fraction of viewport height, so the marker settles at
// roughly the same reading position (comfortably below the sticky header,
// in the upper third of the screen) on any screen size.
const SETTLE_OFFSET = 260;

// The marker only morphs during the final stretch of scroll before each
// stage's arrival point, so it spends the rest of the scroll distance at
// rest on the current stage rather than perpetually catching up. The
// transition's length is a fraction of the actual scroll gap between two
// stages (capped at MAX_TRANSITION_LENGTH) rather than one fixed pixel
// value — a flat value either felt like a rushed snap on generously-spaced
// stages or ate the entire gap (leaving no rest at all) on closely-spaced
// ones. Nearby stages (e.g. the Experience heading and the Panaroma heading
// right under it) still just get a shorter, faster morph, proportional to
// their small gap.
const TRANSITION_FRACTION = 0.85;
const MAX_TRANSITION_LENGTH = 800;

type Shape = { x: number; y: number; width: number; height: number };
type Stage = { group: string; elements: HTMLElement[] };

// getBoundingClientRect() on a heading returns its block-level box, which is
// as wide as its container — not the rendered text. A Range over the same
// content measures the actual glyphs, which is what an underline should
// hug.
function measureText(el: HTMLElement): DOMRect {
  const range = document.createRange();
  range.selectNodeContents(el);
  // jsdom (used under Jest) implements createRange without a working
  // getBoundingClientRect — fall back to the element's own box rather than
  // crash there; real browsers always take the Range measurement.
  if (typeof range.getBoundingClientRect !== "function") return el.getBoundingClientRect();
  return range.getBoundingClientRect();
}

function shapeForElement(el: HTMLElement): Shape {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  if (el.dataset.traceShape === "circle") {
    const rect = el.getBoundingClientRect();
    const diameter = Math.max(rect.width, rect.height) + CIRCLE_PADDING * 2;
    return {
      x: rect.left + scrollX + rect.width / 2 - diameter / 2,
      y: rect.top + scrollY + rect.height / 2 - diameter / 2,
      width: diameter,
      height: diameter,
    };
  }

  const rect = measureText(el);
  return {
    x: rect.left + scrollX,
    y: rect.bottom + scrollY + UNDERLINE_GAP,
    width: rect.width,
    height: UNDERLINE_HEIGHT,
  };
}

// A marker slot with no target this stage collapses to a zero-size point at
// the stage's primary shape, so growing back in on a later stage animates
// out from a nearby point rather than teleporting across the page.
function collapsedShape(anchor: Shape): Shape {
  return { x: anchor.x + anchor.width / 2, y: anchor.y + anchor.height / 2, width: 0, height: 0 };
}

function shapesForStage(stage: Stage): Shape[] {
  const active = stage.elements.map(shapeForElement);
  const anchor = active[0];
  return Array.from({ length: MARKER_SLOTS }, (_, i) => active[i] ?? collapsedShape(anchor));
}

function groupIntoStages(elements: HTMLElement[]): Stage[] {
  const order: string[] = [];
  const groups = new Map<string, HTMLElement[]>();
  for (const el of elements) {
    const key = el.dataset.traceGroup;
    if (!key) continue;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push(el);
  }
  return order.map((group) => ({ group, elements: groups.get(group)! }));
}

function lerpShape(from: Shape, to: Shape, t: number): Shape {
  return {
    x: gsap.utils.interpolate(from.x, to.x, t),
    y: gsap.utils.interpolate(from.y, to.y, t),
    width: gsap.utils.interpolate(from.width, to.width, t),
    height: gsap.utils.interpolate(from.height, to.height, t),
  };
}

// The primary marker's transit shape: retract from `from` into a small dot
// parked on the rail at `from`'s own row, slide that dot down the rail to
// `to`'s row, then extend from the dot into `to`. Each phase interpolates
// continuously from where the previous one ended, so there's no seam at the
// phase boundaries.
function transitDotShape(from: Shape, to: Shape, railX: number, t: number): Shape {
  const dotAtFrom: Shape = {
    x: railX,
    y: from.y + from.height / 2 - DOT_DIAMETER / 2,
    width: DOT_DIAMETER,
    height: DOT_DIAMETER,
  };
  const dotAtTo: Shape = {
    x: railX,
    y: to.y + to.height / 2 - DOT_DIAMETER / 2,
    width: DOT_DIAMETER,
    height: DOT_DIAMETER,
  };

  if (t < PHASE_RETRACT) {
    return lerpShape(from, dotAtFrom, t / PHASE_RETRACT);
  }
  if (t < PHASE_RETRACT + PHASE_TRAVEL) {
    return lerpShape(dotAtFrom, dotAtTo, (t - PHASE_RETRACT) / PHASE_TRAVEL);
  }
  return lerpShape(dotAtTo, to, (t - PHASE_RETRACT - PHASE_TRAVEL) / PHASE_EXTEND);
}

function isCollapsed(shape: Shape): boolean {
  return shape.width === 0 && shape.height === 0;
}

// A secondary marker (Skills' other three column headers) has no shape of
// its own on one side of most transitions — it's collapsed there because
// that stage only needed the primary marker. Rather than growing out of (or
// shrinking into) a fixed point left behind at the old heading, it should
// look like it's riding along inside the primary marker's own dot and only
// peeling off once that dot arrives — `primaryFrom`/`primaryTo` are the
// primary marker's own shapes for this same transition, used only to find
// the dot's row at each point in its journey.
function secondaryTransitShape(
  from: Shape,
  to: Shape,
  primaryFrom: Shape,
  primaryTo: Shape,
  railX: number,
  t: number
): Shape {
  const dotAtFromRow: Shape = {
    x: railX,
    y: primaryFrom.y + primaryFrom.height / 2 - DOT_DIAMETER / 2,
    width: DOT_DIAMETER,
    height: DOT_DIAMETER,
  };
  const dotAtToRow: Shape = {
    x: railX,
    y: primaryTo.y + primaryTo.height / 2 - DOT_DIAMETER / 2,
    width: DOT_DIAMETER,
    height: DOT_DIAMETER,
  };
  const dotRowAt = (progress: number): Shape =>
    progress < PHASE_RETRACT
      ? dotAtFromRow
      : progress < PHASE_RETRACT + PHASE_TRAVEL
        ? lerpShape(dotAtFromRow, dotAtToRow, (progress - PHASE_RETRACT) / PHASE_TRAVEL)
        : dotAtToRow;
  const invisibleAt = (row: Shape): Shape => ({ x: row.x, y: row.y, width: 0, height: 0 });

  if (isCollapsed(from)) {
    // This stage needs it (or doesn't, if `to` is also collapsed) — ride
    // invisibly inside the dot until it's done traveling, then emerge from
    // that same point out to the real target.
    if (t < PHASE_RETRACT + PHASE_TRAVEL) {
      return invisibleAt(dotRowAt(t));
    }
    return lerpShape(dotAtToRow, to, (t - PHASE_RETRACT - PHASE_TRAVEL) / PHASE_EXTEND);
  }

  // Only the previous stage needed it — converge into the dot as it
  // retracts, then stay tucked inside for the rest of the journey.
  if (t < PHASE_RETRACT) {
    return lerpShape(from, dotAtFromRow, t / PHASE_RETRACT);
  }
  return invisibleAt(dotRowAt(t));
}

/**
 * A dim static rail runs down the page's left margin from top to bottom.
 * The primary marker rides it as a small dot while transiting between
 * stages, then peels off the rail to become an underline under headings or
 * a glowing circle behind the social icons — tracing through the page's key
 * sections in document order. Markers sit behind normal content (negative
 * z-index) so the circle reads as a halo behind an icon rather than
 * covering it.
 *
 * Targets are discovered via `data-trace-group="<stage id>"` attributes
 * placed on the relevant elements elsewhere in the tree — this component
 * only needs to mount once (in the root layout) and query the DOM after
 * paint. Elements sharing a group value become one stage with that many
 * simultaneous markers (e.g. all four Skills column headers).
 *
 * Position is driven directly off `window.scrollY` against a precomputed,
 * strictly-increasing "arrival" scroll position per stage — not per-stage
 * ScrollTrigger windows sized off the viewport, which overlap (and can
 * already be mid-transition at the very top of the page) whenever two
 * stages sit closer together than a viewport height apart.
 */
export function ScrollTraceIndicator() {
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const markers = markerRefs.current.filter((m): m is HTMLDivElement => m !== null);
    if (markers.length === 0) return;

    function updateRail(hasTargets: boolean) {
      const rail = railRef.current;
      if (!rail) return;
      if (!hasTargets) {
        // Pages with no scroll-trace targets (e.g. /blog, /blog/[slug]) have
        // nothing to trace — hide the rail rather than let it linger.
        rail.style.height = "0px";
        return;
      }
      // The rail is itself an absolutely-positioned descendant of body, so
      // its own height feeds into document.documentElement.scrollHeight.
      // Zero it before reading that value, or a tall rail left over from a
      // previous page (the App Router keeps this component mounted across
      // client-side navigation) would keep re-measuring its own leftover
      // height forever instead of shrinking to the current page's real
      // content height.
      rail.style.height = "0px";
      const height = document.documentElement.scrollHeight;
      rail.style.left = `${getRailX()}px`;
      rail.style.height = `${height}px`;
    }

    function applyShapes(shapes: Shape[]) {
      shapes.forEach((shape, i) => {
        const marker = markers[i];
        if (!marker) return;
        // Base marker is a 1x1px fully-rounded square; scaleX/scaleY (from a
        // top-left transform origin) reproduce the target rect without ever
        // touching width/height/top/left, so every frame is transform-only.
        gsap.set(marker, { x: shape.x, y: shape.y, scaleX: shape.width, scaleY: shape.height });
      });
    }

    let stageShapes: Shape[][] = [];
    // Absolute document scrollY at which each stage is fully "arrived" —
    // enforced strictly increasing so stages packed together still resolve
    // in order rather than the transition windows overlapping.
    let arrivalScrollY: number[] = [];
    // Where the morph INTO each stage starts (arrivalScrollY[i] - a fixed
    // transition length, clamped to the previous stage's own arrival point).
    // Between a stage's arrival and the next one's transitionStart, the
    // marker simply rests — it does not keep drifting toward the next
    // target the moment it settles.
    let transitionStartScrollY: number[] = [];

    function measure() {
      const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-trace-group]"));
      const stages = groupIntoStages(targets);
      stageShapes = stages.map(shapesForStage);

      // A target near the very end of the page can sit closer to the top of
      // the viewport than SETTLE_OFFSET would ever require once the page is
      // scrolled as far down as it physically goes — there's no more room
      // below it to keep scrolling. Without this clamp, that stage's arrival
      // point would sit past the page's actual max scroll and could never
      // be reached, leaving the marker permanently mid-transition.
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);

      // The first stage is simply the page's resting state before any
      // scrolling happens — it needs no arrival trigger of its own, only a
      // floor of 0 for every later stage to clamp against.
      arrivalScrollY = [0];
      transitionStartScrollY = [0];
      let previous = 0;
      for (const stage of stages.slice(1)) {
        const topmost = Math.min(
          ...stage.elements.map((el) => el.getBoundingClientRect().top + window.scrollY)
        );
        const floor = previous + 1;
        const arrival = Math.min(Math.max(topmost - SETTLE_OFFSET, floor), Math.max(maxScroll, floor));
        const transitionLength = Math.min(MAX_TRANSITION_LENGTH, (arrival - previous) * TRANSITION_FRACTION);
        const transitionStart = Math.max(arrival - transitionLength, previous);
        arrivalScrollY.push(arrival);
        transitionStartScrollY.push(transitionStart);
        previous = arrival;
      }
    }

    function render() {
      if (stageShapes.length === 0) {
        // No targets on this page (e.g. /blog, /blog/[slug]) — hide any
        // markers left over from a previous page rather than leave them
        // sitting at a stale position (the App Router keeps this component
        // mounted across client-side navigation, it doesn't remount it).
        markers.forEach((marker) => gsap.set(marker, { scaleX: 0, scaleY: 0 }));
        return;
      }
      const scrollY = window.scrollY;
      const lastIndex = arrivalScrollY.length - 1;

      if (prefersReducedMotion) {
        let activeIndex = 0;
        for (let i = 0; i <= lastIndex; i++) {
          if (scrollY >= arrivalScrollY[i]) activeIndex = i;
        }
        applyShapes(stageShapes[activeIndex]);
        return;
      }

      if (scrollY <= arrivalScrollY[0]) {
        applyShapes(stageShapes[0]);
        return;
      }
      if (scrollY >= arrivalScrollY[lastIndex]) {
        applyShapes(stageShapes[lastIndex]);
        return;
      }

      for (let i = 1; i <= lastIndex; i++) {
        if (scrollY <= arrivalScrollY[i]) {
          const transitionStart = transitionStartScrollY[i];
          if (scrollY <= transitionStart) {
            // Still resting on the previous stage — the next one hasn't
            // started pulling on the marker yet.
            applyShapes(stageShapes[i - 1]);
            return;
          }
          const t = (scrollY - transitionStart) / (arrivalScrollY[i] - transitionStart);
          const railX = getRailX();
          const primaryFrom = stageShapes[i - 1][0];
          const primaryTo = stageShapes[i][0];
          applyShapes(
            stageShapes[i - 1].map((from, idx) =>
              idx === 0
                ? transitDotShape(primaryFrom, primaryTo, railX, t)
                : secondaryTransitShape(from, stageShapes[i][idx], primaryFrom, primaryTo, railX, t)
            )
          );
          return;
        }
      }
    }

    // Re-measure and re-render on every animation frame rather than only on
    // scroll events. A scroll-only listener stops updating the instant the
    // user stops scrolling, but target positions can still be moving after
    // that — the About/Skills headings sit in a Reveal wrapper whose
    // whileInView fade-in keeps animating (via `transform`, so it changes
    // an element's rect without changing any element's box size — invisible
    // to a ResizeObserver) for up to 500ms after the scroll that triggered
    // it, and the hero's 3D scene mounts after first paint too. A handful of
    // getBoundingClientRect() calls plus a few gsap.set()s is cheap enough
    // to run continuously — this sidesteps needing to know about every
    // possible cause of a stale rect, instead of chasing each one as a
    // separate listener.
    let rafId: number;
    function loop() {
      measure();
      updateRail(stageShapes.length > 0);
      render();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [prefersReducedMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 -z-10 h-0 w-0">
      <div ref={railRef} className="absolute top-0 w-0.5 bg-text-dim opacity-50" />
      {Array.from({ length: MARKER_SLOTS }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            markerRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 h-px w-px origin-top-left rounded-full bg-accent shadow-[0_0_10px_var(--accent)]"
        />
      ))}
    </div>
  );
}
