import { render, screen } from "@testing-library/react";
import { HeroSection } from "../hero-section";

describe("HeroSection", () => {
  it("renders the name and role", () => {
    render(<HeroSection />);
    expect(screen.getByRole("heading", { name: /abhinav joshi/i })).toBeInTheDocument();
    expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
  });

  it("renders the profile photo with descriptive alt text", () => {
    render(<HeroSection />);
    expect(screen.getByAltText(/abhinav joshi/i)).toBeInTheDocument();
  });

  it("tags the role label as the scroll-trace indicator's starting waypoint", () => {
    render(<HeroSection />);
    expect(screen.getByText(/software engineer/i).closest("[data-trace-group]")).toHaveAttribute(
      "data-trace-group",
      "hero-role"
    );
  });

  it("shows availability, what's being built, and what's being learned", () => {
    render(<HeroSection />);
    expect(screen.getByText(/open to opportunities/i)).toBeInTheDocument();
    expect(screen.getByText(/^building$/i)).toBeInTheDocument();
    expect(screen.getByText(/^learning$/i)).toBeInTheDocument();
  });
});
