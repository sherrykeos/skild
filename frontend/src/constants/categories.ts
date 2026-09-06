export interface CategoryMeta {
  name: string;
  slug: string;
  description: string;
  iconName: string;
  accentColor?: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: "Development",
    slug: "development",
    description: "Code generation, review, refactoring, and debugging skills for modern development workflows.",
    iconName: "Code2",
  },
  {
    name: "Research",
    slug: "research",
    description: "Deep research, citation verification, academic synthesis, and structured report generators.",
    iconName: "Compass",
  },
  {
    name: "Productivity",
    slug: "productivity",
    description: "Workflow optimization, task delegation, calendar automation, and executive briefing agents.",
    iconName: "Zap",
  },
  {
    name: "Data Analysis",
    slug: "data-analysis",
    description: "SQL query optimization, data cleaning, statistical modeling, and visual insights pipelines.",
    iconName: "BarChart3",
  },
  {
    name: "Design",
    slug: "design",
    description: "Design systems, UI component generation, typography scalers, and accessibility audits.",
    iconName: "Palette",
  },
  {
    name: "Automation",
    slug: "automation",
    description: "Browser automation, API connectors, web scrapers, and headless orchestration tools.",
    iconName: "Cpu",
  },
  {
    name: "Business",
    slug: "business",
    description: "Market intelligence, competitive analysis, pitch deck formulation, and financial forecasting.",
    iconName: "Briefcase",
  },
  {
    name: "Education",
    slug: "education",
    description: "Personalized tutoring, technical syllabus creation, concept explanations, and flashcard tools.",
    iconName: "GraduationCap",
  },
  {
    name: "Security",
    slug: "security",
    description: "Vulnerability detection, smart contract auditing, secrets scanning, and compliance checks.",
    iconName: "ShieldCheck",
  },
  {
    name: "Writing",
    slug: "writing",
    description: "Technical writing, changelogs, API documentation, ghostwriting, and tone consistency.",
    iconName: "PenTool",
  },
  {
    name: "DevOps",
    slug: "devops",
    description: "CI/CD pipelines, Dockerfile generation, Kubernetes manifests, and infrastructure as code.",
    iconName: "Terminal",
  },
  {
    name: "Marketing",
    slug: "marketing",
    description: "Copywriting, SEO optimization, social campaigns, and growth experiment orchestration.",
    iconName: "Megaphone",
  },
  {
    name: "Other",
    slug: "other",
    description: "Specialized utilities, custom domain tools, esoteric workflows, and experimental skills.",
    iconName: "Layers",
  },
];
