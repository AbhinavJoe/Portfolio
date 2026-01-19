export type ExperienceEntry = {
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: ExperienceEntry[] = [
  {
    company: "Panaroma Intelligence Solutions",
    role: "Software Engineer",
    start: "Feb 2025",
    end: "Present",
    bullets: [
      "Migrated authentication out of the monolith backend into a standalone Python/FastAPI Auth Microservice with a self-hosted Keycloak identity provider, onboarding 12 organizations (58 users) across 3 products in production with multi-tenant, organization-level access segregation and Casbin-based RBAC.",
      "Re-architected the core backend's distributed task processing pipeline, migrating from Celery/Redis to Taskiq running on NATS JetStream, preventing duplicate execution of long-running LLM calls with an early-acknowledgment, durable pull-based consumer model split across three dedicated task queues.",
      "Owned an analytics microservice serving 2 products off a shared FastAPI router, using a per-request resolver and DI container to dispatch each route to product-specific services behind a common service protocol.",
      "Architected a natural-language-to-MongoDB-query chat pipeline with LLM-driven intent classification and safety checks, backed by Beanie ODM and Redis caching shared across both products.",
      "Engineered a document comparison feature and a custom auth handler authenticating requests via Kong-injected headers, on top of Syncfusion's Document Editor reference backend (C#/ASP.NET Core), extending its Redis-backed collaborative-editing operation store and autosave logic.",
      "Led the frontend of a legal CLMS B2B SaaS product to production for 2 enterprise clients using TypeScript, Next.js 15, Redux Toolkit, and React Query, establishing conventions and reviewing 100% of frontend PRs from 2 engineers.",
    ],
  },
  {
    company: "InvoLead Services Pvt. Ltd.",
    role: "Software Developer Intern",
    start: "May 2024",
    end: "Jul 2024",
    bullets: [
      "Contributed to rebuilding a React product in TypeScript and Next.js 14.",
      "Used Next.js server-side capabilities to write end-to-end authentication.",
      "Used ChromaDB and Node.js for data embedding, vector storage, and retrieval in the product's RAG pipeline.",
    ],
  },
];
