import { Reveal } from "@/components/layout/reveal";
import { SectionHeader } from "@/components/layout/section-header";
import { RepoList } from "@/components/repo-list";

export function GithubSection() {
  return (
    <section id="github" className="mx-auto w-full max-w-content px-6 py-16">
      <SectionHeader index="06" title="GitHub" />
      <Reveal>
        <div className="h-80">
          <RepoList />
        </div>
      </Reveal>
    </section>
  );
}
