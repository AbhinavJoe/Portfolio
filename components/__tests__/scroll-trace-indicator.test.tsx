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

// Tests for the marker's temporal smoothing: the rendered marker must chase
// the live scroll position over several frames rather than teleporting with
// it, so a fast wheel flick plays the inter-stage morph as a glide instead
// of a snap. Driven through a fake rAF clock so frame timing (and therefore
// the smoothing curve) is fully deterministic, over a minimal virtual page
// (jsdom has no layout: without pinned rects every element measures at the
// live scroll row and there would be no distance between stages to smooth
// across).
describe("ScrollTraceIndicator smoothed scroll tracking", () => {
  type RafCallback = (time: number) => void;

  // Virtual page: two stages 3000px apart on a 4000px-tall document.
  const PAGE_HEIGHT = 4000;
  const STAGE_B_TOP = 3000;
  const HEADING_HEIGHT = 30;
  // Stage B's settled underline sits at its heading's bottom plus
  // UNDERLINE_GAP (4), in document space.
  const STAGE_B_SETTLED_Y = STAGE_B_TOP + HEADING_HEIGHT + 4;

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
    pinToDocumentTop(alpha, 0);
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

  it("eases into place over several frames after a fast scroll instead of teleporting", () => {
    const { container, unmount } = mountTracedPage();
    flushFrames(2); // first loop pass initializes at the current scroll position

    // A fast flick lands the viewport instantly at stage B's arrival point
    // (its heading top, 3000, minus SETTLE_OFFSET 260). While catching up,
    // the marker rides the rail as a traveling dot whose row follows the
    // smoothed scroll (row = scroll + SETTLE_OFFSET 260 - half the 10px
    // dot), then settles into stage B's underline at STAGE_B_SETTLED_Y.
    scrollYValue = STAGE_B_TOP - 260;
    flushFrames(1);
    const firstFrameY = markerY(primaryMarker(container));

    // After the jump frame the marker is still most of the way up the rail
    // — the travel is spread over the following frames, not spent at once.
    expect(firstFrameY).toBeLessThan(STAGE_B_SETTLED_Y - 200);

    let previousY = firstFrameY;
    for (let i = 0; i < 8; i++) {
      flushFrames(1);
      const y = markerY(primaryMarker(container));
      expect(y).toBeGreaterThan(previousY);
      previousY = y;
    }

    // ~1.6s after the jump the marker has fully caught up and settled into
    // stage B's underline.
    flushFrames(90);
    expect(markerY(primaryMarker(container))).toBeCloseTo(STAGE_B_SETTLED_Y, 0);

    unmount();
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
      scrollYValue = STAGE_B_TOP - 260;
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
