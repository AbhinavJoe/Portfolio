import { render, screen } from "@testing-library/react";
import { SkillsSection } from "../skills-section";

describe("SkillsSection", () => {
  it("renders every skill category from the data layer", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Infra/DevOps")).toBeInTheDocument();
    expect(screen.getByText(/Keycloak/)).toBeInTheDocument();
  });

  it("tags every column header with the same scroll-trace group, so they underline together", () => {
    render(<SkillsSection />);
    const headers = screen.getAllByRole("heading", { level: 3 });
    expect(headers.length).toBeGreaterThanOrEqual(4);
    headers.forEach((header) => expect(header).toHaveAttribute("data-trace-group", "skills"));
  });
});
