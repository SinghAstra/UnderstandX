import { File } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export const fileExtensionIconMap = {
  js: "javascript",
  ts: "typescript",
  jsx: "react",
  tsx: "react",
  java: "java",
  css: "css3",
  md: "markdown",
  mdx: "markdown",
  go: "go",
  astro: "astro",
  prisma: "prisma",
  py: "python",
  kt: "kotlin",
  php: "php",
  gitignore: "git",
  cs: "csharp",
  cpp: "cplusplus",
  c: "c",
  bash: "bash",
  html: "html5",
  json: "json",
};

export function hasSupportedExtension(name: string) {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1];
  if (!ext) return false;
  return !!fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap];
}

export function getIconName(name: string) {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1];
  return fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap];
}

export const getLanguage = (file: File) => {
  const ext = file?.name.split(".").pop();
  switch (ext) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "py":
      return "python";
    default:
      return "javascript";
  }
};
