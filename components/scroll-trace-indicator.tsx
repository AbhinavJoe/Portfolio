"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

// One marker slot per simultaneous target the busiest stage needs (About's
// eyebrow label plus its four skill-category headers, all traced together).
// Reused for every other stage, where unused slots collapse to zero scale.
const MARKER_SLOTS = 5;

const UNDERLINE_HEIGHT = 3;
const UNDERLINE_GAP = 4; // px below the text baseline
// Extra radius around an icon's own bounds. Kept small deliberately — the
// social icons sit close together (and close to the "Find me on:" label),
// so a wider halo here overlapped the label and the neighboring icon.
const CIRCLE_PADDING = 6;

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
// rest on the current stage rather than perpetually catching up — most of
// the gap between two stages, so there's real time to stop and read before
// it fires away, in both scroll directions (this is purely a function of
// scrollY, not a one-way timer). The transition's length is a fraction of
// the actual scroll gap between two stages (capped at MAX_TRANSITION_LENGTH)
// rather than one fixed pixel value — a flat value either felt like a
// rushed snap on generously-spaced stages or ate the entire gap (leaving no
// rest at all) on closely-spaced ones. Nearby stages (e.g. the Experience
// heading and the Panaroma heading right under it) still just get a
// shorter, faster morph, proportional to their small gap.
const TRANSITION_FRACTION = 0.45;
const MAX_TRANSITION_LENGTH = 700;

// document.documentElement.scrollHeight/window.innerHeight are rounded to
// whole CSS pixels, but the browser's actual native scroll ceiling can sit a
// fraction of a px below the integer difference between them (sub-pixel
// layout, non-100% zoom, Lenis's own eased scroll target). Without this
// slack, the last stage's arrival point gets clamped to a scrollY the page
// can never quite reach — window.scrollY tops out just short of it forever
// — so the marker sits permanently a hair into its transition instead of
// settling into the final target (visible as the social-icon circles never
// fully arriving, and looking wrong on the way back up since it never had a
// correct resting shape to reverse from).
const MAX_SCROLL_EPSILON = 2;

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

function dotAtCurrentRow(railX: number, scrollY: number): Shape {
  return { x: railX, y: scrollY + SETTLE_OFFSET - DOT_DIAMETER / 2, width: DOT_DIAMETER, height: DOT_DIAMETER };
}

function easeOutCubic(p: number): number {
  const x = Math.min(Math.max(p, 0), 1);
  return 1 - Math.pow(1 - x, 3);
}

function easeInCubic(p: number): number {
  const x = Math.min(Math.max(p, 0), 1);
  return x * x * x;
}

// Arriving at a target eases in two overlapping stages instead of moving
// x/y/size all at once in a straight line: the row (y) settles first —
// ride the rail down to the right level — then the marker slides in
// horizontally and grows into the target's real size. A single linear lerp
// cut diagonally across the page while also inflating from a 10px dot into
// a full-size shape at the same time, which read as clunky arriving at a
// pair of social-icon circles that sit well off to the right of the rail.
//
// Interpolated by CENTER point, not top-left corner: rowProgress finishes
// (0.55) well before stepProgress does (1.0), so for most of the approach
// height is still short of its final value. Deriving y from a fixed top-left
// corner while height keeps growing would leave the shape's vertical center
// trailing above the target's real center until the very last instant —
// visibly climbing into place off-center rather than expanding around the
// icon it's supposed to be encircling. Holding the center on the eased path
// instead (x/y = center - size/2, using the CURRENT size) keeps the marker's
// middle exactly where rowProgress/stepProgress put it at every frame.
function settleIntoTarget(from: Shape, to: Shape, progress: number): Shape {
  const rowProgress = easeOutCubic(Math.min(progress / 0.55, 1));
  const stepProgress = easeInCubic(Math.max((progress - 0.35) / 0.65, 0));
  const width = gsap.utils.interpolate(from.width, to.width, stepProgress);
  const height = gsap.utils.interpolate(from.height, to.height, stepProgress);
  const centerX = gsap.utils.interpolate(from.x + from.width / 2, to.x + to.width / 2, stepProgress);
  const centerY = gsap.utils.interpolate(from.y + from.height / 2, to.y + to.height / 2, rowProgress);
  return { x: centerX - width / 2, y: centerY - height / 2, width, height };
}

// The mirror of settleIntoTarget for leaving a target: step off
// horizontally (and shrink) first while still at the target's own row, then
// let the row itself start giving way to wherever the rail travel picks up
// next. Same center-based interpolation as settleIntoTarget, for the same
// reason — a shrinking circle should collapse toward its own center, not
// visibly slide off it while its size is still catching up.
function stepOffTarget(from: Shape, to: Shape, progress: number): Shape {
  const stepProgress = easeOutCubic(Math.min(progress / 0.65, 1));
  const rowProgress = easeInCubic(Math.max((progress - 0.45) / 0.55, 0));
  const width = gsap.utils.interpolate(from.width, to.width, stepProgress);
  const height = gsap.utils.interpolate(from.height, to.height, stepProgress);
  const centerX = gsap.utils.interpolate(from.x + from.width / 2, to.x + to.width / 2, stepProgress);
  const centerY = gsap.utils.interpolate(from.y + from.height / 2, to.y + to.height / 2, rowProgress);
  return { x: centerX - width / 2, y: centerY - height / 2, width, height };
}

// The primary marker's transit shape: retract from `from` into a small dot
// on the rail, travel down the rail, then extend from a dot into `to`.
// Travel tracks the live scroll position (`liveDot`) rather than
// interpolating between `from`'s and `to`'s own fixed rows — two headings
// can sit much farther apart in the document than the transition's own
// scroll window is wide (a long section in between), so a straight
// document-position lerp would leave the dot stranded off-screen for most
// of the crossing. Retract and extend, though, each ease toward/from a
// FROZEN anchor (`retractEndDot`/`extendFromDot`, the dot's position at the
// instant that sub-phase starts) rather than the continuously-moving live
// dot — easing toward a target that itself keeps sliding every frame is
// what made arriving at a shape (especially a circle, growing symmetrically
// in both dimensions) read as janky rather than one clean motion. `from` is
// expected to already be resolved via `restingOrTravelingShapes` (so it's
// whatever was actually on screen a moment ago, heading or dot) — the
// retract phase can then unconditionally ease from it.
function transitDotShape(
  from: Shape,
  to: Shape,
  t: number,
  retractEndDot: Shape,
  extendFromDot: Shape,
  liveDot: Shape
): Shape {
  if (t < PHASE_RETRACT) {
    return stepOffTarget(from, retractEndDot, t / PHASE_RETRACT);
  }
  if (t < PHASE_RETRACT + PHASE_TRAVEL) {
    return liveDot;
  }
  return settleIntoTarget(extendFromDot, to, (t - PHASE_RETRACT - PHASE_TRAVEL) / PHASE_EXTEND);
}

function isCollapsed(shape: Shape): boolean {
  return shape.width === 0 && shape.height === 0;
}

// A margin so a shape just barely peeking past the top/bottom edge still
// counts as fully "in view" (no blending) rather than starting to ease
// toward the fallback dot right at the boundary.
const VISIBILITY_MARGIN = 24;

// The marker's fallback whenever its target heading isn't on screen: a
// plain dot riding the rail at a fixed row within the viewport (the same
// SETTLE_OFFSET row a heading "arrives" at), so it keeps following the
// scroll through a long section instead of sitting invisibly over a
// heading that's already scrolled past.
function travelingDotShapes(railX: number, scrollY: number): Shape[] {
  const dot = dotAtCurrentRow(railX, scrollY);
  return Array.from({ length: MARKER_SLOTS }, (_, i) => (i === 0 ? dot : collapsedShape(dot)));
}

// How far past the viewport's (margin-padded) top or bottom edge a shape
// currently sits, in px — 0 while fully in view, growing as it scrolls
// further out either edge.
function overshootPastViewport(shape: Shape, scrollY: number): number {
  const viewTop = scrollY - VISIBILITY_MARGIN;
  const viewBottom = scrollY + window.innerHeight + VISIBILITY_MARGIN;
  return Math.max(viewTop - (shape.y + shape.height), shape.y - viewBottom, 0);
}

// Eases the resting marker from the heading's exact shape into the
// traveling dot (and back) as the heading crosses the viewport edge, over
// this many px of additional scroll — rather than snapping instantly
// between the two the moment a hard visibility check flips, which read as
// the marker jumping between the underline and the rail.
const RESTING_BLEND_ZONE = 120;

function restingOrTravelingShapes(shapes: Shape[], railX: number, scrollY: number): Shape[] {
  const overshoot = overshootPastViewport(shapes[0], scrollY);
  if (overshoot <= 0) return shapes;

  const blend = Math.min(overshoot / RESTING_BLEND_ZONE, 1);
  const dot = travelingDotShapes(railX, scrollY);
  return shapes.map((shape, i) => lerpShape(shape, dot[i], blend));
}

// A secondary marker (About's other skill-category headers, or the second
// social icon) has no shape of its own on one side of most transitions —
// it's collapsed there because that stage only needed the primary marker.
// Rather than growing out of (or shrinking into) a fixed point left behind
// at the old heading, it should look like it's riding along inside the
// primary marker's own dot and only peeling off once that dot arrives.
// It shares the SAME frozen anchor dots as the primary marker (rather than
// chasing the primary's own already-easing, per-frame-moving shape) so the
// two markers move in lockstep off a stable reference instead of one
// eased curve trying to follow another — that compounding was the biggest
// source of jank arriving at the two social-icon circles together. `from`
// is expected to already be resolved via `restingOrTravelingShapes`, same
// as the primary's.
function secondaryTransitShape(
  from: Shape,
  to: Shape,
  t: number,
  retractEndDot: Shape,
  extendFromDot: Shape,
  liveDot: Shape
): Shape {
  if (isCollapsed(from)) {
    // This stage needs it (or doesn't, if `to` is also collapsed) — ride
    // invisibly inside the dot until it's done traveling, then emerge from
    // that same point out to the real target.
    if (t < PHASE_RETRACT + PHASE_TRAVEL) {
      return collapsedShape(liveDot);
    }
    return settleIntoTarget(collapsedShape(extendFromDot), to, (t - PHASE_RETRACT - PHASE_TRAVEL) / PHASE_EXTEND);
  }

  // Only the previous stage needed it — converge into the dot as it
  // retracts, then stay tucked inside for the rest of the journey.
  if (t < PHASE_RETRACT) {
    return stepOffTarget(from, collapsedShape(retractEndDot), t / PHASE_RETRACT);
  }
  return collapsedShape(liveDot);
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
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight - MAX_SCROLL_EPSILON,
        0
      );

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

      const railX = getRailX();

      if (scrollY <= arrivalScrollY[0]) {
        applyShapes(restingOrTravelingShapes(stageShapes[0], railX, scrollY));
        return;
      }
      if (scrollY >= arrivalScrollY[lastIndex]) {
        applyShapes(restingOrTravelingShapes(stageShapes[lastIndex], railX, scrollY));
        return;
      }

      for (let i = 1; i <= lastIndex; i++) {
        if (scrollY <= arrivalScrollY[i]) {
          const transitionStart = transitionStartScrollY[i];
          if (scrollY <= transitionStart) {
            // Still resting on the previous stage — the next one hasn't
            // started pulling on the marker yet. Falls back to a plain
            // traveling dot once the previous stage's own heading has
            // scrolled out of view, so the marker doesn't just vanish for
            // the rest of a long section.
            applyShapes(restingOrTravelingShapes(stageShapes[i - 1], railX, scrollY));
            return;
          }
          const t = (scrollY - transitionStart) / (arrivalScrollY[i] - transitionStart);
          const arrival = arrivalScrollY[i];
          // What was actually on screen the instant this transition began —
          // the exact heading shapes, the traveling dot, or something
          // mid-blend between the two — so the retract phase below always
          // has a real, continuous starting point to animate from.
          const fromShapes = restingOrTravelingShapes(stageShapes[i - 1], railX, transitionStart);
          // Frozen references for the retract and extend sub-phases (see
          // transitDotShape) — each is the dot's position at the instant
          // that sub-phase begins, not a value that keeps sliding as the
          // marker eases toward it.
          const retractEndScrollY = transitionStart + PHASE_RETRACT * (arrival - transitionStart);
          const extendStartScrollY = transitionStart + (PHASE_RETRACT + PHASE_TRAVEL) * (arrival - transitionStart);
          const retractEndDot = dotAtCurrentRow(railX, retractEndScrollY);
          const extendFromDot = dotAtCurrentRow(railX, extendStartScrollY);
          const liveDot = dotAtCurrentRow(railX, scrollY);
          const primaryTo = stageShapes[i][0];
          const primaryShapeNow = transitDotShape(fromShapes[0], primaryTo, t, retractEndDot, extendFromDot, liveDot);
          applyShapes(
            fromShapes.map((from, idx) =>
              idx === 0
                ? primaryShapeNow
                : secondaryTransitShape(from, stageShapes[i][idx], t, retractEndDot, extendFromDot, liveDot)
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
          // No box-shadow here deliberately: this element is scaled up via
          // GSAP's scaleX/scaleY from a 1x1px base (see applyShapes below),
          // and CSS transforms scale the WHOLE paint of an element,
          // box-shadow blur radius included — a "10px" blur ends up
          // rendered dozens of times larger at a circle's ~30-40x scale,
          // constantly resizing every frame. That's what made the
          // social-icon circles balloon past their targets and look janky
          // (an oversized blur being repainted every frame is expensive).
          // A flat fill scales predictably with no such blow-up.
          className="absolute left-0 top-0 h-px w-px origin-top-left rounded-full bg-accent"
        />
      ))}
    </div>
  );
}
