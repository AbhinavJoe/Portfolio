export type Project = {
  title: string;
  stack: string[];
  desc: string;
  video: string;
  thumbnail: string;
  link: string;
  /** Set to false when no real demo recording exists for this project — hides the "Play Demo" affordance instead of borrowing another project's video. Defaults to true when omitted. */
  hasDemo?: boolean;
};

export const projects: Project[] = [
  {
    title: "KubeCentrix: Fraud Detector",
    stack: ["JavaScript", "Manifest v3", "Flask", "Machine Learning"],
    desc: "Hackathon-winning Chrome extension (Rajasthan Police Hackathon 1.0) that blocks fraudulent URLs using SSL checks, keyword analysis, and an ML model trained to 94.6% accuracy, backed by a Flask REST API.",
    video: "/samples/KubeCentrixDemo.mp4",
    thumbnail: "/thumbnail/KubeCentrixDemo.png",
    link: "https://github.com/AbhinavJoe/KubeCentrix",
  },
  {
    title: "Reactflow-X-DAG",
    stack: ["JavaScript", "React", "Zustand", "ReactFlow", "Python", "FastAPI"],
    desc: "A visual pipeline builder using React Flow and Zustand for the canvas and state, with cycle detection and DAG analysis handled by a FastAPI backend.",
    video: "/samples/Reactflow.mp4",
    thumbnail: "/thumbnail/Reactflow.png",
    link: "https://github.com/AbhinavJoe/Reactflow-X-DAG",
  },
  {
    title: "FinCentrix: AI Powered Financial Advisory",
    stack: ["JavaScript", "TypeScript", "Next.js", "Express", "ChromaDB", "Docker", "Microsoft Azure"],
    desc: "FinCentrix is an innovative platform that offers personalized financial guidance, transforming how people handle their finances.",
    video: "/samples/FinCentrix.mp4",
    thumbnail: "/thumbnail/FinCentrix.png",
    link: "https://github.com/AbhinavJoe/FinCentrix-A-User-Centric-AI-Financial-Advisor",
  },
  {
    title: "Google Search Automation",
    stack: ["Python", "TkinterGUI"],
    desc: "A simple Python software to automate Google searches.",
    video: "/samples/Google.mp4",
    thumbnail: "/thumbnail/Google.png",
    link: "https://github.com/AbhinavJoe/Google-Search-Automation",
  },
  {
    title: "RAG-X-Langchain-JS",
    stack: ["JavaScript", "Node.js", "ChromaDB", "LangchainJS"],
    desc: "RAGXLangchainJS is a Multi-Doc RAG Application made using JavaScript, Node.js, LangChainJS, and ChromaDB to make your life easier.",
    video: "/samples/RAGXLangchain.mp4",
    thumbnail: "/thumbnail/RAGXLangchain.png",
    link: "https://github.com/AbhinavJoe/RAG-X-Langchain-JS",
  },
];
