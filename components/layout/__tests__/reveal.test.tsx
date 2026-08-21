import { render, screen } from "@testing-library/react";
import { Reveal } from "../reveal";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

describe("Reveal", () => {
  it("renders children directly with no wrapper when the OS prefers reduced motion", () => {
    mockMatchMedia(true);
    const { container } = render(
      <Reveal>
        <p>Reduced motion content</p>
      </Reveal>
    );

    // No-op: the child should be the direct first element, not wrapped in an
    // extra motion.div, and it should carry no animation-related inline style.
    const child = container.firstElementChild as HTMLElement;
    expect(child.tagName).toBe("P");
    expect(child.getAttribute("style")).toBeNull();
    expect(screen.getByText("Reduced motion content")).toBeInTheDocument();
  });

  it("wraps children in an animated motion.div when motion is not reduced", () => {
    mockMatchMedia(false);
    const { container } = render(
      <Reveal>
        <p>Animated content</p>
      </Reveal>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.tagName).toBe("DIV");
    expect(wrapper.querySelector("p")).toHaveTextContent("Animated content");
  });
});
