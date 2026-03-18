import { render, screen } from "@testing-library/react";
import { Socials } from "../socials";

describe("Socials", () => {
  it("links to LinkedIn and GitHub", () => {
    render(<Socials />);
    expect(screen.getByLabelText("LinkedIn")).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/abhinavjoe/"
    );
    expect(screen.getByLabelText("GitHub")).toHaveAttribute(
      "href",
      "https://github.com/abhinavjoe"
    );
  });

  it("tags both icons as a simultaneous scroll-trace circle waypoint", () => {
    render(<Socials />);
    for (const link of [screen.getByLabelText("LinkedIn"), screen.getByLabelText("GitHub")]) {
      expect(link).toHaveAttribute("data-trace-group", "socials");
      expect(link).toHaveAttribute("data-trace-shape", "circle");
    }
  });
});
