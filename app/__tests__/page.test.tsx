import { render } from "@testing-library/react";
import HomePage from "../page";

describe("HomePage", () => {
  it("renders every section in document order", () => {
    const { container } = render(<HomePage />);
    const ids = ["hero", "about", "skills", "experience", "projects", "contact"];
    const renderedIds = Array.from(container.querySelectorAll("[id]"))
      .map((el) => el.id)
      .filter((id) => ids.includes(id));
    expect(renderedIds).toEqual(ids);
  });
});
