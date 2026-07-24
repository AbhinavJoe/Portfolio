export type SkillGroup = { category: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { category: "Languages", items: ["JavaScript / TypeScript", "Python", "SQL", "C++"] },
  { category: "Development", items: ["React", "Next.js", "Express", "Flask", "FastAPI", "REST APIs"] },
  {
    category: "Infra/DevOps",
    items: ["AWS (S3, EC2, RDS, ElastiCache, Elastic Beanstalk)", "Azure", "Docker", "Nginx", "Kong", "Keycloak", "Git"],
  },
  { category: "Data & Messaging", items: ["MongoDB", "PostgreSQL", "Redis", "NATS JetStream", "Taskiq", "Celery"] },
  { category: "Observability", items: ["OpenTelemetry", "Grafana", "Prometheus", "Loki", "Tempo"] },
  { category: "AI / LLM", items: ["LLM APIs (OpenAI, Anthropic, Gemini)", "RAG", "ChromaDB"] },
];
