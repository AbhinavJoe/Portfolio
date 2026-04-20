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
    render(<ProjectCard project={project} isPlaying={false} onPlayDemo={jest.fn()} onStopDemo={jest.fn()} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("href", project.link);
  });

  // Demo playback is controlled by the parent (ProjectsSection) so only one
  // card can play at a time — the card itself just reports intent via
  // onPlayDemo/onStopDemo and renders whatever `isPlaying` says.
  it("asks the parent to play the demo when 'Play Demo' is clicked", () => {
    const onPlayDemo = jest.fn();
    render(<ProjectCard project={project} isPlaying={false} onPlayDemo={onPlayDemo} onStopDemo={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /play demo/i }));
    expect(onPlayDemo).toHaveBeenCalledTimes(1);
  });

  it("renders the demo video and asks the parent to stop it when 'Back to Details' is clicked", () => {
    const onStopDemo = jest.fn();
    render(<ProjectCard project={project} isPlaying={true} onPlayDemo={jest.fn()} onStopDemo={onStopDemo} />);
    fireEvent.click(screen.getByRole("button", { name: /back to details/i }));
    expect(onStopDemo).toHaveBeenCalledTimes(1);
  });

  it("does not render a 'Play Demo' button when the project has no real demo", () => {
    render(
      <ProjectCard
        project={{ ...project, hasDemo: false }}
        isPlaying={false}
        onPlayDemo={jest.fn()}
        onStopDemo={jest.fn()}
      />
    );
    expect(screen.queryByRole("button", { name: /play demo/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });
});
