import { render, screen } from "@testing-library/react";
import { SiteHeader } from "../site-header";

describe("SiteHeader", () => {
  it("links to the blog", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
  });

  it("links to every home section anchor", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: /experience/i })).toHaveAttribute("href", "/#experience");
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute("href", "/#projects");
  });
});
