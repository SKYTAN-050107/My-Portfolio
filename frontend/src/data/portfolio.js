import { Code, Server, Layout, Smartphone, Globe, Layers, Database } from "lucide-react";

export const heroContent = {
  name: "SKY",
  title: "Undergraduate student of Universiti Malaya, specializing in Data Science.",
  tagline: " Code with purpose. Build with impact.",
};

export const contactInfo = {
  email: "skycode112324@example.com", 
};

export const expertise = [
  {
    id: 1,
    icon: Globe,
    title: "Web Development",
    desc: "React, Vite, Next.js",
    stat: "10+",
    statLabel: "Projects",
  },
  {
    id: 2,
    icon: Layers,
    title: "Machine Learning",
    desc: "Jupyter Notebook, Streamlit",
    stat: "High",
    statLabel: "Model Accuracy(%)",
  },
  {
    id: 3,
    icon: Server,
    title: "Backend Logic",
    desc: "Node.js, Firebase, SQL",
    stat: "API",
    statLabel: "Integrations",
  },
  {
    id: 4,
    icon: Smartphone,
    title: "NLP frameworks",
    desc: "Langchain, Hugging Face",
    stat: "RAG",
    statLabel: "Development",
  },
];

export const projects = [
  {
    id: 1,
    title: "RecycleNow",
    category: "Full Stack · PWA",
    description: "AI-powered waste classification and recycling marketplace.",
    icon: Code,
    role: "Lead Developer",
    year: "2026",
    stack: ["React", "Node.js", "Firebase", "TensorFlow"],
    github: "https://github.com/SKYTAN-050107/KITA_HACK-2026-FEB",
    live: "https://example.com/recyclenow",
    screenshot: "/recyclenow.png",
    screenshots: [
      "/recyclenow.png",
      "https://placehold.co/1280x960/111111/ffffff?text=RecycleNow+-+Dashboard",
      "https://placehold.co/1280x960/1f2937/ffffff?text=RecycleNow+-+Marketplace",
      "https://placehold.co/1280x960/374151/ffffff?text=RecycleNow+-+Classifier",
    ],
  },
  {
    id: 2,
    icon: Database,
    title: "Data Dashboard",
    category: "Analytics · BI",
    description: "Visualizing complex datasets with D3.js and Recharts.",
    role: "Data Engineer",
    year: "2025",
    stack: ["React", "D3.js", "Recharts", "PostgreSQL"],
    github: "https://github.com/SKYTAN-050107/data-dashboard",
    live: "https://example.com/data-dashboard",
    screenshot: "https://placehold.co/1280x960/0f172a/ffffff?text=Data+Dashboard+-+Overview",
    screenshots: [
      "https://placehold.co/1280x960/0f172a/ffffff?text=Data+Dashboard+-+Overview",
      "https://placehold.co/1280x960/1e293b/ffffff?text=Data+Dashboard+-+Insights",
      "https://placehold.co/1280x960/334155/ffffff?text=Data+Dashboard+-+Forecast",
      "https://placehold.co/1280x960/475569/ffffff?text=Data+Dashboard+-+Reports",
    ],
  },
  {
    id: 3,
    icon: Layout,
    title: "Portfolio V1",
    category: "Personal",
    description: "The iteration before the monochrome shift.",
    role: "Designer + Frontend",
    year: "2024",
    stack: ["React", "TailwindCSS", "Framer Motion"],
    github: "https://github.com/SKYTAN-050107/portfolio-v1",
    live: "https://example.com/portfolio-v1",
    screenshot: "https://placehold.co/1280x960/111827/ffffff?text=Portfolio+V1+-+Hero",
    screenshots: [
      "https://placehold.co/1280x960/111827/ffffff?text=Portfolio+V1+-+Hero",
      "https://placehold.co/1280x960/1f2937/ffffff?text=Portfolio+V1+-+Projects",
      "https://placehold.co/1280x960/374151/ffffff?text=Portfolio+V1+-+About",
      "https://placehold.co/1280x960/4b5563/ffffff?text=Portfolio+V1+-+Contact",
    ],
  },
];
