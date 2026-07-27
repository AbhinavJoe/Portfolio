import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "../experience-section";

describe("ExperienceSection", () => {
  it("renders both roles with their date ranges", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Holmes AI Pvt. Ltd.")).toBeInTheDocument();
    expect(screen.getByText(/Feb 2025.*Present/)).toBeInTheDocument();
    expect(screen.getByText("InvoLead Services Pvt. Ltd.")).toBeInTheDocument();
  });

  it("renders every bullet for each role", () => {
    render(<ExperienceSection />);
    expect(screen.getByText(/self-hosted Keycloak/)).toBeInTheDocument();
  });

  it("tags each company with a distinct scroll-trace group, in order, but not the section heading itself", () => {
    render(<ExperienceSection />);
    expect(screen.getByRole("heading", { name: "Experience" })).not.toHaveAttribute("data-trace-group");
    expect(screen.getByRole("heading", { name: "Holmes AI Pvt. Ltd." })).toHaveAttribute(
      "data-trace-group",
      "exp-0"
    );
    expect(screen.getByRole("heading", { name: "InvoLead Services Pvt. Ltd." })).toHaveAttribute(
      "data-trace-group",
      "exp-1"
    );
  });
});
