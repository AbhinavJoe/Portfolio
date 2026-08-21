import { render, screen } from "@testing-library/react";
import { AboutSection } from "../about-section";

describe("AboutSection", () => {
  it("renders the bio copy", () => {
    render(<AboutSection />);
    expect(screen.getByText(/backend-leaning software engineer/i)).toBeInTheDocument();
  });

  it("tags the heading as a scroll-trace waypoint", () => {
    render(<AboutSection />);
    expect(screen.getByRole("heading", { name: "About" })).toHaveAttribute(
      "data-trace-group",
      "about"
    );
  });
});
