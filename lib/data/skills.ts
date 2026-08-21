export type SkillGroup = { category: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { category: "Languages", items: ["JavaScript / TypeScript", "Python", "C#", "C++"] },
  { category: "Development", items: ["React", "Next.js", "Express", "Flask", "FastAPI", "ASP.NET Core"] },
  {
    category: "Infra/DevOps",
    items: ["AWS (EC2, EBS, RDS, ElastiCache)", "Azure", "Docker", "Nginx", "Kong", "Keycloak"],
  },
  { category: "Data", items: ["MongoDB", "PostgreSQL", "Redis", "NATS JetStream"] },
];
