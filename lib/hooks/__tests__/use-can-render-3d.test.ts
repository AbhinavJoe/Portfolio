import { renderHook } from "@testing-library/react";
import { useCanRender3D } from "../use-can-render-3d";

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: reducedMotion,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

function mockInnerWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
}

function mockWebGL(available: boolean) {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation((type: string) => {
    if (available && (type === "webgl" || type === "experimental-webgl")) {
      return {};
    }
    return null;
  }) as typeof HTMLCanvasElement.prototype.getContext;
}

describe("useCanRender3D", () => {
  it("returns true when wide viewport, WebGL available, and motion not reduced", () => {
    mockMatchMedia(false);
    mockInnerWidth(1024);
    mockWebGL(true);

    const { result } = renderHook(() => useCanRender3D());
    expect(result.current).toBe(true);
  });

  it("returns false when the OS prefers reduced motion, even if WebGL is available and viewport is wide", () => {
    mockMatchMedia(true);
    mockInnerWidth(1024);
    mockWebGL(true);

    const { result } = renderHook(() => useCanRender3D());
    expect(result.current).toBe(false);
  });

  it("returns false when the viewport is narrower than 768px", () => {
    mockMatchMedia(false);
    mockInnerWidth(500);
    mockWebGL(true);

    const { result } = renderHook(() => useCanRender3D());
    expect(result.current).toBe(false);
  });

  it("returns false when WebGL is not available", () => {
    mockMatchMedia(false);
    mockInnerWidth(1024);
    mockWebGL(false);

    const { result } = renderHook(() => useCanRender3D());
    expect(result.current).toBe(false);
  });
});
