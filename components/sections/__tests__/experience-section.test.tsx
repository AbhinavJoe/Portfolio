import { render, screen } from "@testing-library/react";
import { ExperienceSection } from "../experience-section";

describe("ExperienceSection", () => {
  it("renders both roles with their date ranges", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Panaroma Intelligence Solutions")).toBeInTheDocument();
    expect(screen.getByText(/Feb 2025.*Present/)).toBeInTheDocument();
    expect(screen.getByText("InvoLead Services Pvt. Ltd.")).toBeInTheDocument();
  });

  it("renders every bullet for each role", () => {
    render(<ExperienceSection />);
    expect(screen.getByText(/Keycloak identity provider/)).toBeInTheDocument();
  });

  it("tags each company with a distinct scroll-trace group, in order, but not the section heading itself", () => {
    render(<ExperienceSection />);
    expect(screen.getByRole("heading", { name: "Experience" })).not.toHaveAttribute("data-trace-group");
    expect(screen.getByRole("heading", { name: "Panaroma Intelligence Solutions" })).toHaveAttribute(
      "data-trace-group",
      "exp-0"
    );
    expect(screen.getByRole("heading", { name: "InvoLead Services Pvt. Ltd." })).toHaveAttribute(
      "data-trace-group",
      "exp-1"
    );
  });
});
