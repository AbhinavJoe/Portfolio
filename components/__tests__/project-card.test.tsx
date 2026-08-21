import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "../project-card";
import type { Project } from "@/lib/data/projects";

const project: Project = {
  title: "Test Project",
  stack: ["TypeScript"],
  desc: "A project for testing.",
  video: "/samples/Reactflow.mp4",
  thumbnail: "/thumbnail/Reactflow.png",
  link: "https://github.com/AbhinavJoe/test",
};

describe("ProjectCard", () => {
  it("shows the title and GitHub link by default", () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", project.link);
  });

  it("flips to the demo video when 'Play Demo' is clicked, and back on 'Back to Details'", () => {
    render(<ProjectCard project={project} />);
    fireEvent.click(screen.getByRole("button", { name: /play demo/i }));
    expect(screen.getByRole("button", { name: /back to details/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /back to details/i }));
    expect(screen.getByRole("button", { name: /play demo/i })).toBeInTheDocument();
  });
});
