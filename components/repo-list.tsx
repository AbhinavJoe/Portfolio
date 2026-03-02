"use client";

import { useEffect, useState } from "react";

type Repo = {
  name: string;
  url: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  license: string;
};

type GitHubApiRepo = {
  name: string;
  html_url: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  license: { name: string } | null;
};

export function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchRepos() {
      try {
        const response = await fetch("https://api.github.com/users/AbhinavJoe/repos");
        const raw: GitHubApiRepo[] = await response.json();
        const formatted: Repo[] = raw
          .map((repo) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            license: repo.license?.name ?? "No License",
          }))
          .sort((a: Repo, b: Repo) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        if (!cancelled) setRepos(formatted);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    }

    fetchRepos();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-full w-full overflow-y-auto rounded-xl border border-border">
      <div className="flex flex-col gap-2 p-3">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border p-3 hover:border-accent"
          >
            <h3 className="font-mono text-sm font-semibold text-text">{repo.name}</h3>
            <p className="text-xs text-text-dim">{repo.description ?? "No description"}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
