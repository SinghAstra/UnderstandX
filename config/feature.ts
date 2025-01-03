import { Feature } from "@/interfaces/feature";
import { Code, Database, Globe, Search } from "lucide-react";

export const features: Feature[] = [
  {
    title: "Semantic Code Search",
    description:
      "Easily find relevant code snippets across your GitHub repositories using advanced AI-powered semantic search.",
    icon: Search,
    colorClass: "stats-blue",
  },
  {
    title: "Code Understanding",
    description:
      "Break down complex code with AI-generated explanations to understand its purpose, structure, and logic.",
    icon: Code,
    colorClass: "stats-purple",
  },
  {
    title: "Repository Insights",
    description:
      "Analyze your GitHub repository with visualizations and insights into code structure, dependencies, and usage.",
    icon: Globe,
    colorClass: "stats-pink",
  },
  {
    title: "Database Schema Visualization",
    description:
      "Automatically generate and visualize database schemas from your GitHub codebase for better understanding.",
    icon: Database,
    colorClass: "stats-orange",
  },
];
