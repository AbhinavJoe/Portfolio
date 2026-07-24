export type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "Holmes AI Pvt. Ltd.",
    role: "Software Engineer II",
    start: "Feb 2025",
    end: "Present",
    bullets: [
      "Promoted to Software Engineer II after 13 months — from co-owning core backend features and leading the frontend to solely owning 3 backend microservices, while still owning the frontend, infrastructure, and deployment.",
      "Architected core backend features for a GenAI contract lifecycle management (CLMS) SaaS platform on AWS — LLM-based contract redlining, contract generation, and metadata extraction — saving 20+ lawyer hours weekly.",
      "Extracted authentication from the monolith into a standalone FastAPI service on self-hosted Keycloak, delivering OIDC/OAuth2 SSO, multi-tenant org-level isolation, and Casbin RBAC for 12 organizations.",
      "Re-architected the distributed task pipeline from Celery/Redis to Taskiq on NATS JetStream, with early-ack durable pull consumers across 3 task queues, so long-running LLM calls no longer execute twice.",
      "Migrated user data from MongoDB to PostgreSQL on AWS RDS with zero downtime, remapping IDs across 20 downstream collections using idempotent, dry-run-by-default scripts.",
      "Stood up the observability stack — Grafana, Loki, Tempo, Prometheus behind a dual OTel Collector gateway — with OpenTelemetry and Grafana Faro giving end-to-end browser-to-backend traces, plus self-hosted GlitchTip for frontend errors.",
      "Led an AI analytics dashboard that turns natural language into MongoDB aggregation pipelines at 90%+ accuracy, after evaluating GPT-4o, o1, Claude 3.7, and Gemini.",
      "Integrated a third-party document editor behind the Kong API Gateway with a custom auth handler, extending its Redis-backed collaborative-editing store and autosave logic.",
      "Led the CLMS frontend (Next.js 15, TypeScript, Redux Toolkit, React Query) to production for 2 enterprise clients, reviewing 100% of frontend PRs from 2 engineers.",
    ],
  },
  {
    company: "InvoLead Services Pvt. Ltd.",
    role: "Software Developer Intern",
    start: "May 2024",
    end: "Jul 2024",
    bullets: [
      "Rebuilt a GenAI chatbot in TypeScript and Next.js 14 that lets users upload business-metric CSVs, query them in natural language, and visualize results with Recharts.",
      "Built the RAG pipeline from scratch in Node.js — context-aware chunking, embeddings, and ChromaDB retrieval — reaching 85% retrieval recall with correct source citations.",
      "Self-hosted open-source LLMs (Llama 3, CodeGemma, Moondream) via Ollama on Oracle Cloud, load-tested to sub-5s responses at 15 concurrent requests.",
    ],
  },
];
