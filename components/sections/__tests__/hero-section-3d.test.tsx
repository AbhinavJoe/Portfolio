import { act, render, screen } from "@testing-library/react";
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
  // `HeroScene` is loaded through next/dynamic, so it resolves on a later tick
  // rather than during the synchronous render — hence findBy* here.
  it("renders the 3D scene when the capability check passes", async () => {
    (useCanRender3D as jest.Mock).mockReturnValue(true);
    render(<HeroSection />);
    expect(await screen.findByTestId("hero-scene-3d")).toBeInTheDocument();
    expect(screen.queryByTestId("hero-scene-fallback")).not.toBeInTheDocument();
  });

  it("renders the static fallback when it doesn't", async () => {
    (useCanRender3D as jest.Mock).mockReturnValue(false);
    render(<HeroSection />);
    expect(await screen.findByTestId("hero-scene-fallback")).toBeInTheDocument();
    // Give the dynamic import the same chance to resolve as the test above; it
    // must never be reached when the capability check fails.
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByTestId("hero-scene-3d")).not.toBeInTheDocument();
  });
});
