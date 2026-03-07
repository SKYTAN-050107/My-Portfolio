import { Code, Server, Layout, Smartphone, Globe, Layers, Database } from "lucide-react";

export const heroContent = {
  name: "SKY",
  title: "Undergraduate student of Universiti Malaya, specializing in Data Science.",
  tagline: " Code with purpose. Build with impact.",
};

export const contactInfo = {
  email: "skycode112324@example.com", 
};

export const socialLinks = {
  instagram: "https://www.instagram.com/sytn05?igsh=N25ibWgxcnYyZmZu",
  linkedin: "https://www.linkedin.com/in/tan-shi-kai-78937a359?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  github: "https://github.com/SKYTAN-050107",
  location: "Malaysia",
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
    role: "Project Lead + Full Stack Developer",
    year: "2026 Feb",
    stack: ["React", "Google Cloud services", "Firebase", "Google Vertex AI"],
    github: "https://github.com/SKYTAN-050107/KITA_HACK-2026-FEB",
    live: "https://kitahack-487005.web.app",
    screenshot: "/recyclenow/recyclenow-landing.png",
    screenshots: [
      "/recyclenow/recyclenow-landing.png",
      "/recyclenow/recyclenow-login.png",
      "/recyclenow/recyclenow-dashboard.png",
      "/recyclenow/recyclenow-entreprise.png",
    ],
  },
  {
    id: 2,
    icon: Code,
    title: "ShieldSync",
    category: "Full Stack · PWA",
    description: "Your safety, our priority - a web-based public safety application",
    role: "Self Project + Full Stack Developer",
    year: "2025",
    stack: ["React", "Leaflet", "Google Gemini", "Firebase"],
    github: "https://github.com/SKYTAN-050107/KRACKATHON_ShieldSync",
    live: "https://example.com/data-dashboard",
    screenshot: "/shieldsync/landing.png",
    screenshots: [
      "/shieldsync/landing.png",
      "/shieldsync/landing2.png",
      "/shieldsync/login.png",
      "/shieldsync/signup.png",
      "/shieldsync/page1.png",
      "/shieldsync/page2.png",
      "/shieldsync/page3.png",
      "/shieldsync/page4.png",
      "/shieldsync/page5.png",
    ],
  },
  {
    id: 3,
    icon: Code,
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
