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
});
