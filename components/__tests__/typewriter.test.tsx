import { act, render, screen } from "@testing-library/react";
import { Typewriter } from "../typewriter";

const PHRASES = ["Software Engineer II", "Microservices"];

function mockReducedMotion(matches: boolean) {
  window.matchMedia = jest.fn().mockImplementation(() => ({
    matches,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("Typewriter", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("renders the first phrase in full immediately", () => {
    mockReducedMotion(false);
    render(<Typewriter phrases={PHRASES} />);
    expect(screen.getByText("Software Engineer II")).toBeInTheDocument();
  });

  it("erases the first phrase and types the next one", () => {
    mockReducedMotion(false);
    const { container } = render(<Typewriter phrases={PHRASES} />);
    act(() => {
      jest.advanceTimersByTime(2000 + 20 * 28 + 250 + 13 * 55 + 10);
    });
    expect(container).toHaveTextContent("Microservices");
  });

  it("never animates under reduced motion", () => {
    mockReducedMotion(true);
    const { container } = render(<Typewriter phrases={PHRASES} />);
    act(() => {
      jest.advanceTimersByTime(20000);
    });
    expect(container).toHaveTextContent("Software Engineer II");
  });
});
