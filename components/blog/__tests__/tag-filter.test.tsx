import { render, screen, fireEvent } from "@testing-library/react";
import { TagFilter } from "../tag-filter";

describe("TagFilter", () => {
  it("calls onSelect with the clicked tag, and with null for 'All'", () => {
    const onSelect = jest.fn();
    render(<TagFilter tags={["fastapi", "redis"]} activeTag={null} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole("button", { name: "fastapi" }));
    expect(onSelect).toHaveBeenCalledWith("fastapi");

    fireEvent.click(screen.getByRole("button", { name: /all/i }));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("marks the active tag with aria-pressed", () => {
    render(<TagFilter tags={["fastapi", "redis"]} activeTag="redis" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "redis" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "fastapi" })).toHaveAttribute("aria-pressed", "false");
  });
});
