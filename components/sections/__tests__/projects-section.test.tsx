import { render, screen } from "@testing-library/react";
import { ProjectsSection } from "../projects-section";

describe("ProjectsSection", () => {
  it("renders every project card", () => {
    render(<ProjectsSection />);
    expect(screen.getByText(/KubeCentrix/)).toBeInTheDocument();
  });

  it("tags the heading as a scroll-trace waypoint", () => {
    render(<ProjectsSection />);
    expect(screen.getByRole("heading", { name: "Projects" })).toHaveAttribute(
      "data-trace-group",
      "projects"
    );
  });
});
