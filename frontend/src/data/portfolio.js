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
    icon: Code,
    title: "EcoTracker",
    category: "Web App",
    description: "A sustainable habit tracking app with dark mode and gamification.",
  },
  {
    id: 2,
    icon: Database,
    title: "Data Dashboard",
    category: "Analytics",
    description: "Visualizing complex datasets with D3.js and Recharts.",
  },
  {
    id: 3,
    icon: Layout,
    title: "Portfolio V1",
    category: "Personal",
    description: "The iteration before the monochrome shift.",
  },
];
