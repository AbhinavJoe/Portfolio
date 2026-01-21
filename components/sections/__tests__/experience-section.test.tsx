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
});
