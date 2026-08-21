import { render, screen } from "@testing-library/react";
import { BlogPreviewSection } from "../blog-preview-section";
import type { BlogPost } from "@/lib/blog";

const post: BlogPost = {
  slug: "pulling-auth-out-of-the-monolith",
  title: "Pulling Auth Out of the Monolith",
  date: "2026-08-21",
  tags: ["fastapi", "keycloak"],
  company: "Panaroma Intelligence Solutions",
  role: "Software Engineer",
  excerpt: "How I extracted authentication into a standalone service.",
  readingTime: "9 min read",
  content: "",
};

describe("BlogPreviewSection", () => {
  it("renders the latest posts", () => {
    render(<BlogPreviewSection posts={[post]} />);
    expect(screen.getByText("Pulling Auth Out of the Monolith")).toBeInTheDocument();
  });

  it("tags the heading as a scroll-trace waypoint", () => {
    render(<BlogPreviewSection posts={[post]} />);
    expect(screen.getByRole("heading", { name: "From the blog" })).toHaveAttribute(
      "data-trace-group",
      "blog-preview"
    );
  });
});
