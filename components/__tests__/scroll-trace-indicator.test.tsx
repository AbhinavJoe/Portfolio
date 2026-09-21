import { render } from "@testing-library/react";
import { ScrollTraceIndicator } from "../scroll-trace-indicator";

function TaggedPage() {
  return (
    <div>
      <h2 data-trace-group="a">Alpha</h2>
      <h2 data-trace-group="b">Beta</h2>
      <ScrollTraceIndicator />
    </div>
  );
}

describe("ScrollTraceIndicator", () => {
  it("mounts without crashing alongside its scroll-trace targets", () => {
    expect(() => render(<TaggedPage />)).not.toThrow();
  });

  it("renders the static rail plus five hidden marker slots, invisible to the accessibility tree", () => {
    const { container } = render(<TaggedPage />);
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).toBeInTheDocument();
    // 1 rail + MARKER_SLOTS (5) markers.
    expect(wrapper?.children.length).toBe(6);
  });

  it("still mounts cleanly when no scroll-trace targets exist on the page", () => {
    expect(() => render(<ScrollTraceIndicator />)).not.toThrow();
  });

  it("hides the rail when the page has no scroll-trace targets, instead of sizing it off document height", async () => {
    // Regression test: the rail is an absolutely-positioned descendant of
    // body, so its own height feeds into document.documentElement.scrollHeight.
    // On a page with no targets (e.g. /blog) it must collapse to zero rather
    // than adopt a leftover height from a previously-rendered page — the App
    // Router keeps this component mounted across client-side navigation, so
    // a tall rail left at its old height would keep re-measuring itself and
    // never shrink, leaving the shorter page scrollable well past its content.
    const { container } = render(<ScrollTraceIndicator />);
    await new Promise((resolve) => setTimeout(resolve, 50));
    const rail = container.querySelector('[aria-hidden="true"] > div');
    expect(rail).toHaveStyle({ height: "0px" });
  });

  it("mounts cleanly under prefers-reduced-motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    expect(() => render(<TaggedPage />)).not.toThrow();

    window.matchMedia = original;
  });
});

// Tests for the marker's clock-driven morph: a stage change must play out over
// time rather than teleporting with the scroll, so a fast wheel flick shows a
// glide instead of a snap. Driven through a fake rAF clock so frame timing is
// fully deterministic, over a minimal virtual page
// (jsdom has no layout: without pinned rects every element measures at the
// live scroll row and there would be no distance between stages to smooth
// across).
describe("ScrollTraceIndicator stage morph", () => {
  type RafCallback = (time: number) => void;

  // Virtual page: two stages 3000px apart on a 4000px-tall document.
  const PAGE_HEIGHT = 4000;
  const STAGE_B_TOP = 3000;
  // Stage A sits where the hero role line does: comfortably below the nav.
  const ALPHA_TOP = 200;
  const HEADING_HEIGHT = 30;
  // Stage B's settled underline sits at its heading's bottom plus
  // UNDERLINE_GAP (4), in document space.
  const STAGE_B_SETTLED_Y = STAGE_B_TOP + HEADING_HEIGHT + 4;
  // Past stage B's window (see the morph tests below): it is docked here.
  const PAST_B_TRIGGER = 2616;

  let pendingCallbacks: Map<number, RafCallback>;
  let nextRafId: number;
  let fakeNow: number;
  let scrollYValue: number;
  const originalRaf = window.requestAnimationFrame;
  const originalCancelRaf = window.cancelAnimationFrame;

  beforeEach(() => {
    pendingCallbacks = new Map();
    nextRafId = 1;
    fakeNow = 0;
    scrollYValue = 0;
    window.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      const id = nextRafId++;
      pendingCallbacks.set(id, cb);
      return id;
    }) as typeof requestAnimationFrame;
    // Must actually drop the callback: the component re-subscribes when
    // prefers-reduced-motion resolves, and a stale loop from the first
    // effect run would keep rendering alongside the real one.
    window.cancelAnimationFrame = ((id: number) => {
      pendingCallbacks.delete(id);
    }) as typeof cancelAnimationFrame;
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      get: () => scrollYValue,
    });
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      get: () => 768,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      get: () => PAGE_HEIGHT,
    });
  });

  afterEach(() => {
    window.requestAnimationFrame = originalRaf;
    window.cancelAnimationFrame = originalCancelRaf;
    delete (window as unknown as { scrollY?: number }).scrollY;
    delete (window as unknown as { innerHeight?: number }).innerHeight;
    delete (document.documentElement as unknown as { scrollHeight?: number }).scrollHeight;
  });

  // Pin an element to a fixed document position: jsdom rects are all-zero,
  // so hand back a box whose viewport top tracks the (mocked) scroll such
  // that its document-space top stays constant — what a real browser's
  // layout guarantees and what the component's math assumes.
  function pinToDocumentTop(el: Element, documentTop: number) {
    el.getBoundingClientRect = () =>
      ({
        x: 0,
        y: documentTop - scrollYValue,
        top: documentTop - scrollYValue,
        bottom: documentTop + HEADING_HEIGHT - scrollYValue,
        left: 0,
        right: 640,
        width: 640,
        height: HEADING_HEIGHT,
        toJSON: () => ({}),
      }) as DOMRect;
  }

  function mountTracedPage() {
    const rendered = render(<TaggedPage />);
    const [alpha, beta] = Array.from(rendered.container.querySelectorAll("h2"));
    pinToDocumentTop(alpha, ALPHA_TOP);
    pinToDocumentTop(beta, STAGE_B_TOP);
    return rendered;
  }

  // Advance the fake clock `count` frames, 16ms apart (60fps).
  function flushFrames(count: number) {
    for (let i = 0; i < count; i++) {
      fakeNow += 16;
      const callbacks = [...pendingCallbacks.values()];
      pendingCallbacks.clear();
      callbacks.forEach((cb) => cb(fakeNow));
    }
  }

  function primaryMarker(container: HTMLElement): HTMLElement {
    const wrapper = container.querySelector('[aria-hidden="true"]');
    if (!wrapper) throw new Error("marker wrapper not found");
    return wrapper.children[1] as HTMLElement; // children[0] is the rail
  }

  function markerY(el: HTMLElement): number {
    const match = el.style.transform.match(/translate(?:3d)?\(\s*(-?[\d.]+)px[\s,]+(-?[\d.]+)/);
    if (!match) throw new Error(`no translate in "${el.style.transform}"`);
    return parseFloat(match[2]);
  }

  // Stage B's window, with the mocked 768px viewport: it closes (docks) when
  // its heading reaches mid-screen — scrollY 3000 - 0.5*768 = 2616 — and
  // opens a 0.42*768 = 322px span earlier, at ~2293.
  const B_WINDOW_START = 2293;
  const B_DOCK = 2616;

  function markerYAt(container: HTMLElement, scroll: number): number {
    scrollYValue = scroll;
    flushFrames(2);
    return markerY(primaryMarker(container));
  }

  it("rests on the first heading's underline until the next heading enters", () => {
    const { container, unmount } = mountTracedPage();
    expect(markerYAt(container, 0)).toBeCloseTo(ALPHA_TOP + HEADING_HEIGHT + 4, 0);
    unmount();
  });

  it("grows from the rail dot into the next heading's underline across its window", () => {
    const { container, unmount } = mountTracedPage();
    flushFrames(2);

    // Before the window opens the marker is the plain dot on the rail
    // (the first heading is long gone), at its fixed viewport row.
    const dotRow = (scroll: number) => scroll + 260 - 5;
    expect(markerYAt(container, B_WINDOW_START - 50)).toBeCloseTo(dotRow(B_WINDOW_START - 50), 0);

    // Through the window it travels smoothly (never moving backwards)...
    let previous = -Infinity;
    for (let scroll = B_WINDOW_START; scroll <= B_DOCK; scroll += 20) {
      const y = markerYAt(container, scroll);
      expect(y).toBeGreaterThanOrEqual(previous - 0.001);
      previous = y;
    }

    // ...and is fully docked on B's underline when the heading hits mid-screen.
    expect(markerYAt(container, B_DOCK)).toBeCloseTo(STAGE_B_SETTLED_Y, 0);
    unmount();
  });

  it("is a pure function of scroll: the same scrollY gives the same marker whichever way you arrived", () => {
    const { container, unmount } = mountTracedPage();
    flushFrames(2);
    markerYAt(container, B_DOCK);
    const comingBack = markerYAt(container, 2450);

    markerYAt(container, 0);
    const goingForward = markerYAt(container, 2450);

    expect(comingBack).toBeCloseTo(goingForward, 5);
    unmount();
  });

  it("never streaks through the viewport when the page jumps around", () => {
    const { container, unmount } = mountTracedPage();
    flushFrames(2);
    // Whatever the history, every frame the marker must be within (or just
    // beside) the viewport of the CURRENT scroll position.
    for (const jump of [2900, 0, 1500, 300, 2600, 100, 2450, 3200, 40]) {
      const y = markerYAt(container, jump);
      expect(y).toBeGreaterThan(jump - 200);
      expect(y).toBeLessThan(jump + 768 + 200);
    }
    unmount();
  });

  it("flags a circle target as covered by the marker once the marker rests on it", () => {
    const rendered = render(
      <div>
        <h2 data-trace-group="a" data-trace-shape="circle">
          Tile
        </h2>
        <ScrollTraceIndicator />
      </div>
    );
    const tile = rendered.container.querySelector("h2") as HTMLElement;
    pinToDocumentTop(tile, 200);
    flushFrames(3);
    expect(tile.style.getPropertyValue("--trace-cover")).toBe("1");
    rendered.unmount();
  });

  it("keeps instant, unsmoothed positioning under prefers-reduced-motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;

    try {
      const { container, unmount } = mountTracedPage();
      flushFrames(2);
      scrollYValue = PAST_B_TRIGGER;
      flushFrames(1);
      const immediateY = markerY(primaryMarker(container));
      flushFrames(30);
      // No chase: the marker sits at its final position from the first
      // frame after the jump and never moves again.
      expect(markerY(primaryMarker(container))).toBeCloseTo(immediateY, 5);
      unmount();
    } finally {
      window.matchMedia = original;
    }
  });
});
