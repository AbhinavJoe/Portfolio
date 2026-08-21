import { render, screen } from "@testing-library/react";
import { SkillsSection } from "../skills-section";

describe("SkillsSection", () => {
  it("renders every skill category from the data layer", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Infra/DevOps")).toBeInTheDocument();
    expect(screen.getByText(/Keycloak/)).toBeInTheDocument();
  });
});
