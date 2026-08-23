import { act, render } from "@testing-library/react";
import HomePage from "../page";

describe("HomePage", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([]),
    }) as jest.Mock;
  });

  it("renders every section in document order", async () => {
    const { container } = render(<HomePage />);
    // Flush the ContactSection's repo-fetching effect (mocked above) so its
    // resulting state update happens inside act(), not after the test body.
    await act(async () => {
      await Promise.resolve();
    });
    const ids = ["hero", "about", "experience", "projects", "blog-preview", "contact"];
    const renderedIds = Array.from(container.querySelectorAll("[id]"))
      .map((el) => el.id)
      .filter((id) => ids.includes(id));
    expect(renderedIds).toEqual(ids);
  });
});
