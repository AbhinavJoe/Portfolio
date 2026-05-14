import "@testing-library/jest-dom";

// jsdom does not implement window.matchMedia. Provide a default mock (motion
// not reduced) so components using media queries (e.g. reduced-motion
// checks) don't crash in tests that don't explicitly mock it. Individual
// tests can still override window.matchMedia to exercise other branches.
// (Plain functions, not jest.fn(), so this non-test file doesn't need the
// `jest` value typings that aren't installed as a project dependency.)
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom does not implement IntersectionObserver, which framer-motion's
// `whileInView` (used by the Reveal wrapper) relies on. Stub it out (this
// setup file only runs under Jest's jsdom environment, so unconditionally
// providing a mock here never touches a real browser's implementation) so
// components using it can mount in tests.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

if (typeof window !== "undefined") {
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
    MockIntersectionObserver;
}
if (typeof global !== "undefined") {
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
    MockIntersectionObserver;
}

// jsdom does not implement ResizeObserver, which ProjectCard relies on to
// detect whether its stack badges wrapped onto a second line. Stub it out
// the same way as IntersectionObserver above so components using it can
// mount in tests.
class MockResizeObserver implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== "undefined") {
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = MockResizeObserver;
}
if (typeof global !== "undefined") {
  (global as unknown as { ResizeObserver: unknown }).ResizeObserver = MockResizeObserver;
}
