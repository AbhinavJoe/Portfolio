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

  it("tags every icon as a simultaneous scroll-trace circle waypoint when traced", () => {
    render(<Socials traced />);
    for (const link of [screen.getByLabelText("LinkedIn"), screen.getByLabelText("GitHub"), screen.getByLabelText("Writing")]) {
      expect(link).toHaveAttribute("data-trace-group", "socials");
      expect(link).toHaveAttribute("data-trace-shape", "circle");
    }
  });

  it("leaves the icons out of the scroll trace by default", () => {
    render(<Socials />);
    expect(screen.getByLabelText("GitHub")).not.toHaveAttribute("data-trace-group");
  });
});
