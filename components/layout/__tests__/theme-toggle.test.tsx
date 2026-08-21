import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../theme-toggle";

const setTheme = jest.fn();
let resolvedTheme = "dark";

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme, setTheme }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    setTheme.mockClear();
    resolvedTheme = "dark";
  });

  it("renders a toggle button once mounted", async () => {
    render(<ThemeToggle />);
    expect(await screen.findByRole("button")).toBeInTheDocument();
  });

  it("calls setTheme with the opposite theme when clicked", async () => {
    render(<ThemeToggle />);
    const button = await screen.findByRole("button");
    fireEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("switches to dark when the resolved theme is light", async () => {
    resolvedTheme = "light";
    render(<ThemeToggle />);
    const button = await screen.findByRole("button");
    fireEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
