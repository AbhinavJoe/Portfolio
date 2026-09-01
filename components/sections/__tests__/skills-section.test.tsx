import { render, screen } from "@testing-library/react";
import { SkillsSection } from "../skills-section";

describe("SkillsSection", () => {
  it("renders each skill category with its technologies", () => {
    render(<SkillsSection />);
    expect(screen.getByRole("heading", { name: /skills/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText("Languages")).toBeInTheDocument();
    expect(screen.getByText("Redis")).toBeInTheDocument();
  });
});
