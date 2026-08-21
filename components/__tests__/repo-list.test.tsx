import { render, screen, waitFor } from "@testing-library/react";
import { RepoList } from "../repo-list";

const mockRepos = [
  {
    name: "z-repo",
    html_url: "https://github.com/AbhinavJoe/z-repo",
    description: "older",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    license: null,
  },
  {
    name: "a-repo",
    html_url: "https://github.com/AbhinavJoe/a-repo",
    description: "newer",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
    license: { name: "MIT" },
  },
];

describe("RepoList", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockRepos),
    }) as jest.Mock;
  });

  it("fetches repos and sorts them by most-recently updated first", async () => {
    render(<RepoList />);
    await waitFor(() => expect(screen.getByText("a-repo")).toBeInTheDocument());
    const names = screen.getAllByRole("heading").map((el) => el.textContent);
    expect(names).toEqual(["a-repo", "z-repo"]);
  });
});
