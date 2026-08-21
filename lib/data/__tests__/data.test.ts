import { experience } from "../experience";
import { skillGroups } from "../skills";
import { projects } from "../projects";

describe("content data", () => {
  it("has both resume roles in reverse-chronological order", () => {
    expect(experience.map((e) => e.company)).toEqual([
      "Panaroma Intelligence Solutions",
      "InvoLead Services Pvt. Ltd.",
    ]);
  });

  it("groups skills by resume category", () => {
    expect(skillGroups.map((g) => g.category)).toEqual([
      "Languages",
      "Development",
      "Infra/DevOps",
      "Data",
    ]);
  });

  it("includes KubeCentrix among the projects", () => {
    expect(projects.some((p) => p.title.includes("KubeCentrix"))).toBe(true);
  });

  it("keeps every project's demo assets pointing at public/", () => {
    for (const p of projects) {
      expect(p.video.startsWith("/samples/")).toBe(true);
      expect(p.thumbnail.startsWith("/thumbnail/")).toBe(true);
    }
  });
});
