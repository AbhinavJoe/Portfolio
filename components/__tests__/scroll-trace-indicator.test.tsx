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

  it("renders the static rail plus four hidden marker slots, invisible to the accessibility tree", () => {
    const { container } = render(<TaggedPage />);
    const wrapper = container.querySelector('[aria-hidden="true"]');
    expect(wrapper).toBeInTheDocument();
    // 1 rail + MARKER_SLOTS (4) markers.
    expect(wrapper?.children.length).toBe(5);
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
