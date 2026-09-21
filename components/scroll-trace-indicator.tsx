"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { subscribeFrame } from "@/lib/frame-loop";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

// One marker slot per simultaneous target the busiest stage needs (the
// hero's three social tiles). Reused for every other stage, where unused
// slots collapse to zero scale.
const MARKER_SLOTS = 5;

const UNDERLINE_HEIGHT = 3;
const UNDERLINE_GAP = 4; // px below the text baseline
// Circle targets (the social tiles) are covered edge to edge; 1px of
// overshoot stops an anti-aliased hairline of tile border showing past it.
const CIRCLE_PADDING = 1;

// The marker rides the rail as a dot of this size between targets.
const DOT_DIAMETER = 10;

// The row of the viewport (px below its top) the rail dot rides at.
const DOT_ROW = 260;

// The rail sits just left of the content column (max-w-content = 48rem, so
// 24rem half-width, plus a 1.5rem gutter), collapsing to a small fixed margin
// once the viewport is too narrow for that gap to make sense. Mirrors the
// visible rail element's own CSS `left`.
const REM = 16; // assumed root font-size — this project never overrides it
function getRailX(): number {
  return Math.max(REM, window.innerWidth / 2 - 25.5 * REM);
}

/*
 * HOW THE MARKER MOVES
 *
 * The marker's shape is a PURE FUNCTION of the scroll position — there is no
 * timer, no "current stage" state and nothing to restart. That is what keeps
 * it correct at any scroll speed, in either direction, and after any jump:
 * the same scrollY always produces the same picture.
 *
 * Every stage (a heading, or the hero's social tiles) owns a window of scroll
 * distance [start, dock] during which the dot on the rail grows into that
 * stage's target. The window is anchored to where the heading sits ON SCREEN:
 *
 *   - it opens as the heading peeks in at the bottom (ENTER_FRACTION of the
 *     viewport height), and
 *   - it closes — marker fully docked — when the heading reaches the middle
 *     of the screen (DOCK_FRACTION),
 *
 * so the marker always lands on a heading the reader can actually see, however
 * fast they scroll. Docked, the marker is glued to the heading (it lives in
 * document space, so it scrolls natively with it). As the heading leaves
 * under the floating nav it lets go and drops back to the dot on the rail.
 */
const ENTER_FRACTION = 0.92;
const DOCK_FRACTION = 0.5;

// Stages packed closer together than their ideal windows (the hero crams the
// role line, the social tiles and the About heading into one screen) are
// squeezed, but never below these, so each still gets a visible morph and a
// moment docked before the next one starts pulling on the marker.
const MIN_WINDOW = 150;
const DWELL = 60;
// The very first hop (role line -> social tiles): the tiles are already on
// screen at load, so it opens at scroll 0 and finishes by this much scroll.
const FIRST_HOP_DOCK = 120;

// A docked marker lets go of its heading as the heading's centre row rises
// through this band (px from the top of the viewport): fully attached at
// LEAVE_FULL_ROW, fully back on the rail by LEAVE_GONE_ROW. LEAVE_FULL_ROW
// sits just below the floating nav.
const LEAVE_FULL_ROW = 120;
const LEAVE_GONE_ROW = -20;

// document.documentElement.scrollHeight/window.innerHeight are rounded to
// whole CSS pixels, but the browser's actual native scroll ceiling can sit a
// fraction of a px below the integer difference between them. Without this
// slack, a stage whose window ends at the page's very bottom could never
// fully dock.
const MAX_SCROLL_EPSILON = 2;

type Shape = { x: number; y: number; width: number; height: number };
type Stage = { group: string; elements: HTMLElement[] };
type StageWindow = { start: number; dock: number };

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

function clamp01(x: number): number {
  return Math.min(Math.max(x, 0), 1);
}

function easeOutCubic(p: number): number {
  return 1 - Math.pow(1 - clamp01(p), 3);
}

function easeInOutCubic(p: number): number {
  const x = clamp01(p);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function lerpShape(from: Shape, to: Shape, t: number): Shape {
  return {
    x: gsap.utils.interpolate(from.x, to.x, t),
    y: gsap.utils.interpolate(from.y, to.y, t),
    width: gsap.utils.interpolate(from.width, to.width, t),
    height: gsap.utils.interpolate(from.height, to.height, t),
  };
}

// Interpolates by CENTER point (not top-left corner), so a shape that is
// growing or shrinking stays centered on the path between its endpoints
// instead of visibly sliding off its own middle while its size catches up.
function lerpByCenter(from: Shape, to: Shape, tx: number, ty: number, ts: number): Shape {
  const width = gsap.utils.interpolate(from.width, to.width, ts);
  const height = gsap.utils.interpolate(from.height, to.height, ts);
  const centerX = gsap.utils.interpolate(from.x + from.width / 2, to.x + to.width / 2, tx);
  const centerY = gsap.utils.interpolate(from.y + from.height / 2, to.y + to.height / 2, ty);
  return { x: centerX - width / 2, y: centerY - height / 2, width, height };
}

// Leaving a target: collapse toward the dot with one smooth ease across x, y
// and size together.
function stepOffTarget(from: Shape, to: Shape, progress: number): Shape {
  const p = easeInOutCubic(progress);
  return lerpByCenter(from, to, p, p, p);
}

// Arriving at a target eases in two overlapping stages instead of moving
// x/y/size all at once in a straight line: the row (y) settles first, then
// the marker slides in horizontally and grows into the target's real size.
// A single linear lerp cut diagonally across the page while inflating from a
// 10px dot, which read as clunky arriving at the social tiles that sit well
// off to the right of the rail.
function settleIntoTarget(from: Shape, to: Shape, progress: number): Shape {
  const row = easeOutCubic(Math.min(progress / 0.55, 1));
  const step = easeInOutCubic(Math.max((progress - 0.2) / 0.8, 0));
  return lerpByCenter(from, to, step, row, step);
}

// The rail dot, as one shape per marker slot: slot 0 is the dot, the rest are
// tucked inside it.
function dotShapes(railX: number, scrollY: number): Shape[] {
  const dot: Shape = {
    x: railX,
    y: scrollY + DOT_ROW - DOT_DIAMETER / 2,
    width: DOT_DIAMETER,
    height: DOT_DIAMETER,
  };
  return Array.from({ length: MARKER_SLOTS }, (_, i) => (i === 0 ? dot : collapsedShape(dot)));
}

// How attached a docked marker still is to its heading, 1 → 0, as the
// heading's centre row rises up through the nav and off the top. (Scrolling
// back up, the same ramp runs in reverse as the heading returns.)
function attachment(shape: Shape, scrollY: number): number {
  const row = shape.y + shape.height / 2 - scrollY;
  return easeInOutCubic((row - LEAVE_GONE_ROW) / (LEAVE_FULL_ROW - LEAVE_GONE_ROW));
}

// Where the marker sits when it is simply resting on a stage: glued to the
// stage's targets while their headings are on screen, easing back onto the
// rail dot as they leave.
function restingShapes(stageShapes: Shape[], railX: number, scrollY: number): Shape[] {
  const held = attachment(stageShapes[0], scrollY);
  if (held >= 1) return stageShapes;
  const dot = dotShapes(railX, scrollY);
  return stageShapes.map((shape, i) => lerpShape(dot[i], shape, held));
}

// One frame of the grow-from-the-dot morph into `to` (a stage's resting
// shapes) at progress t of its window. `before` is where the marker was
// resting on the PREVIOUS stage at this very scroll position. If that is
// still a real shape (the previous heading is on screen) the marker first
// retracts into the dot, then grows out; if it is already the dot (the usual
// case — the previous heading has long since left) the whole window goes to
// growing, so there is no dead stretch where nothing moves. The split is
// blended continuously by how attached the marker still is to the previous
// heading, so it never jumps as that heading slides off screen.
function morphShapes(before: Shape[], to: Shape[], railX: number, scrollY: number, t: number): Shape[] {
  const dot = dotShapes(railX, scrollY);
  const holdingPrevious = attachment(before[0], scrollY);
  const retractEnd = 0.38 * holdingPrevious;
  const extendStart = 0.5 * holdingPrevious;

  return Array.from({ length: MARKER_SLOTS }, (_, i) => {
    const point = collapsedShape(dot[0]);
    const home = i === 0 ? dot[0] : point;
    if (t < retractEnd) {
      // Slots with nothing to retract (collapsed already) just wait inside the dot.
      const wasCollapsed = before[i].width === 0 && before[i].height === 0;
      return wasCollapsed ? home : stepOffTarget(before[i], home, t / retractEnd);
    }
    if (t < extendStart) return home;
    return settleIntoTarget(home, to[i], (t - extendStart) / (1 - extendStart));
  });
}

// How much of a circle target (a social tile) the marker currently covers,
// 0–1: it has to be both close to full size and centered on the tile. Drives
// the tile's --trace-cover CSS variable, which fades the tile's own fill and
// border out and flips its icon to the page-background colour, so the icon
// stays legible once the (high-contrast) marker sits behind it.
function coverage(marker: Shape, target: Shape): number {
  const size = clamp01(Math.min(marker.width, marker.height) / Math.min(target.width, target.height));
  const dx = marker.x + marker.width / 2 - (target.x + target.width / 2);
  const dy = marker.y + marker.height / 2 - (target.y + target.height / 2);
  const near = clamp01(1 - Math.hypot(dx, dy) / target.width);
  return size * near;
}

/**
 * A dim static rail runs down the page's left margin from top to bottom.
 * The marker rides it as a small dot, grows into an underline beneath each
 * heading as that heading rises into the reading area, and into a disc behind
 * each social tile in the hero — tracing through the page's key sections in
 * document order. Markers sit behind normal content (negative z-index) so a
 * disc reads as a backing circle behind an icon rather than covering it.
 *
 * Targets are discovered via `data-trace-group="<stage id>"` attributes
 * placed on the relevant elements elsewhere in the tree — this component
 * only needs to mount once (in the root layout) and query the DOM after
 * paint. Elements sharing a group value become one stage with that many
 * simultaneous markers (e.g. the three social tiles). See "HOW THE MARKER
 * MOVES" above for the model.
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

    let stages: Stage[] = [];
    let stageShapes: Shape[][] = [];
    let windows: StageWindow[] = [];
    const lastCover = new WeakMap<HTMLElement, number>();

    function measure() {
      const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-trace-group]"));
      stages = groupIntoStages(targets);
      stageShapes = stages.map(shapesForStage);

      const viewport = window.innerHeight;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - viewport - MAX_SCROLL_EPSILON,
        0
      );
      const idealSpan = (ENTER_FRACTION - DOCK_FRACTION) * viewport;

      // Chain the windows in document order. Each one closes (dock) when its
      // heading reaches the middle of the screen and opens an ideal span
      // before that, but is never allowed to open before the previous stage
      // has docked and had its moment of rest, nor to be shorter than
      // MIN_WINDOW. The first stage is simply the page's resting state.
      windows = [{ start: -Infinity, dock: 0 }];
      for (let i = 1; i < stages.length; i++) {
        const previous = windows[i - 1];
        const top = Math.min(...stages[i].elements.map((el) => el.getBoundingClientRect().top + window.scrollY));
        const earliest = i === 1 ? 0 : previous.dock + DWELL;
        const minDock = i === 1 ? FIRST_HOP_DOCK : earliest + MIN_WINDOW;
        let dock = Math.max(top - DOCK_FRACTION * viewport, minDock);
        let start = Math.max(dock - idealSpan, earliest);
        // A stage near the end of the page may need more scroll than the page
        // has. Pull its window in to fit, keeping it strictly after the
        // previous one, rather than leaving it unreachable.
        if (dock > maxScroll) {
          dock = Math.max(maxScroll, previous.dock + 2);
          start = Math.min(start, Math.max(dock - 1, previous.dock + 1));
        }
        windows.push({ start, dock });
      }
    }

    function updateCoverage(shapes: Shape[]) {
      stages.forEach((stage, s) => {
        stage.elements.forEach((el, j) => {
          if (el.dataset.traceShape !== "circle") return;
          const value = Math.round(coverage(shapes[j], stageShapes[s][j]) * 100) / 100;
          if (lastCover.get(el) === value) return;
          lastCover.set(el, value);
          el.style.setProperty("--trace-cover", String(value));
        });
      });
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
      const railX = getRailX();

      // The owner is the latest stage whose window has opened.
      let owner = 0;
      for (let i = 1; i < windows.length; i++) {
        if (scrollY >= windows[i].start) owner = i;
      }

      const resting = restingShapes(stageShapes[owner], railX, scrollY);
      let shapes = resting;

      if (owner > 0 && !prefersReducedMotion && scrollY < windows[owner].dock) {
        const { start, dock } = windows[owner];
        const t = clamp01((scrollY - start) / (dock - start));
        const before = restingShapes(stageShapes[owner - 1], railX, scrollY);
        shapes = morphShapes(before, resting, railX, scrollY, t);
      }

      applyShapes(shapes);
      updateCoverage(shapes);
    }

    // Re-measure and re-render on every animation frame rather than only on
    // scroll events. A scroll-only listener stops updating the instant the
    // user stops scrolling, but target positions can still be moving after
    // that — Reveal wrappers keep animating their `transform` (which changes
    // an element's rect without changing any element's box size, invisible
    // to a ResizeObserver) for up to 500ms after the scroll that triggered
    // them. A handful of getBoundingClientRect() calls plus a few gsap.set()s
    // is cheap enough to run continuously.
    //
    // Order 10: after Lenis (order 0, see SmoothScrollProvider) has applied
    // this frame's scroll, so window.scrollY here is the value being painted.
    const unsubscribe = subscribeFrame(() => {
      measure();
      updateRail(stageShapes.length > 0);
      render();
    }, 10);

    return () => {
      unsubscribe();
      stages.forEach((stage) =>
        stage.elements.forEach((el) => el.style.removeProperty("--trace-cover"))
      );
    };
  }, [prefersReducedMotion]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 -z-10 h-0 w-0">
      <div ref={railRef} className="absolute top-0 w-px bg-border" />
      {Array.from({ length: MARKER_SLOTS }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            markerRefs.current[i] = el;
          }}
          // No box-shadow here deliberately: this element is scaled up via
          // GSAP's scaleX/scaleY from a 1x1px base (see applyShapes above),
          // and CSS transforms scale the WHOLE paint of an element,
          // box-shadow blur radius included — a "10px" blur ends up
          // rendered dozens of times larger at a circle's ~30-40x scale,
          // constantly resizing every frame. A flat fill scales predictably
          // with no such blow-up.
          className="absolute left-0 top-0 h-px w-px origin-top-left rounded-full bg-accent"
        />
      ))}
    </div>
  );
}
