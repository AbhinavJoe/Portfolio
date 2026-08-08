import { render, screen, waitFor } from "@testing-library/react";
import { GithubActivity } from "../github-activity";

const day = (date: string, count: number, level: number) => ({ date, count, level });

describe("GithubActivity", () => {
  afterEach(() => {
    // @ts-expect-error — restoring the absent jsdom global
    delete global.fetch;
  });

  it("shows the total and a labelled graph once the contributions load", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          total: { lastYear: 1234 },
          contributions: [day("2026-10-11", 0, 0), day("2026-10-12", 3, 2), day("2026-10-13", 1, 1)],
        }),
    }) as jest.Mock;

    render(<GithubActivity />);

    expect(await screen.findByText(/1,234 contributions in the last year/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /1234 contributions in the last year/ })).toBeInTheDocument();
    expect(screen.getByTitle("3 contributions on Oct 12, 2026")).toBeInTheDocument();
    expect(screen.getByTitle("No contributions on Oct 11, 2026")).toBeInTheDocument();
  });

  it("links to the GitHub profile", () => {
    global.fetch = jest.fn().mockReturnValue(new Promise(() => {})) as jest.Mock;
    render(<GithubActivity />);
    expect(screen.getByRole("link", { name: /github activity/i })).toHaveAttribute(
      "href",
      "https://github.com/abhinavjoe"
    );
  });

  it("degrades quietly when the request fails", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("offline")) as jest.Mock;
    render(<GithubActivity />);
    await waitFor(() => expect(screen.getByText(/couldn’t load activity/)).toBeInTheDocument());
  });

  it("degrades quietly when there is no fetch at all", async () => {
    render(<GithubActivity />);
    await waitFor(() => expect(screen.getByText(/couldn’t load activity/)).toBeInTheDocument());
  });
});
