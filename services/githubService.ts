import { Octokit } from "@octokit/rest";

export class GitHubService {
  private octokit: Octokit;

  constructor(authToken?: string) {
    this.octokit = new Octokit({
      auth: authToken,
    });
  }

  private parseGitHubUrl(url: string): { owner: string; repo: string } {
    try {
      const urlObj = new URL(url);
      const [, owner, repo] = urlObj.pathname.split("/");
      if (!owner || !repo) {
        throw new Error("Invalid GitHub URL format");
      }
      return { owner, repo: repo.replace(".git", "") };
    } catch (error) {
      throw new Error(`Invalid GitHub URL: ${error}`);
    }
  }

  async analyzeRepository(url: string) {
    const { owner, repo } = this.parseGitHubUrl(url);

    try {
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo,
      });

      const { data: languageData } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      });

      const totalBytes = Object.values(languageData).reduce((a, b) => a + b, 0);
      const languages = Object.entries(languageData).map(([name, bytes]) => {
        return {
          name,
          percentage: Math.round((bytes / totalBytes) * 100),
        };
      });

      console.log("languages is ", languages);

      let dependencies: string[] = [];
      let frameworks: string[] = [];

      try {
        const { data: packageJson } = await this.octokit.repos.getContent({
          owner,
          repo,
          path: "package.json",
        });

        if ("content" in packageJson) {
          const content = JSON.parse(
            Buffer.from(packageJson.content, "base64").toString()
          );

          dependencies = [
            ...Object.keys(content.dependencies || {}),
            ...Object.keys(content.devDependencies || {}),
          ];

          // Detect common frameworks
          frameworks = this.detectFrameworks(dependencies);
        }
      } catch (error) {
        console.log("No package.json found or unable to parse", error);
      }

      return {
        repository: {
          name: repoData.name,
          description: repoData.description || "",
          language: repoData.language || "",
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
        },
        technicalDetails: {
          languages,
          frameworks,
          dependencies,
        },
        generatedPrompt: this.generateAnalysisPrompt({
          name: repoData.name,
          description: repoData.description || "",
          languages,
          frameworks,
        }),
      };
    } catch (err) {
      console.log("error --analyzeRepository is ", err);
      throw new Error("Failed to analyze repository");
    }
  }

  private detectFrameworks(dependencies: string[]): string[] {
    const frameworkMap: Record<string, string> = {
      // Frontend Frameworks & Libraries
      next: "Next.js",
      react: "React",
      "react-dom": "React",
      vue: "Vue.js",
      "@vue/core": "Vue.js",
      nuxt: "Nuxt.js",
      angular: "Angular",
      "@angular/core": "Angular",
      svelte: "Svelte",
      "svelte-kit": "SvelteKit",
      "@remix-run/react": "Remix",
      gatsby: "Gatsby",
      preact: "Preact",
      solid: "SolidJS",
      qwik: "Qwik",
      astro: "Astro",

      // Backend Frameworks
      "@nestjs/core": "NestJS",
      express: "Express.js",
      fastify: "Fastify",
      koa: "Koa",
      "next-connect": "NextConnect",
      "@trpc/server": "tRPC",
      "@hapi/hapi": "Hapi",
      "apollo-server": "Apollo Server",
      "@graphql-yoga/node": "GraphQL Yoga",
      "type-graphql": "TypeGraphQL",

      // UI Libraries & Design Systems
      tailwindcss: "Tailwind CSS",
      "@mui/material": "Material UI",
      "@chakra-ui/react": "Chakra UI",
      "@mantine/core": "Mantine",
      "styled-components": "Styled Components",
      "@emotion/react": "Emotion",
      "@radix-ui/react-primitive": "Radix UI",
      "framer-motion": "Framer Motion",
      antd: "Ant Design",
      "@headlessui/react": "Headless UI",
      bootstrap: "Bootstrap",
      "@shadcn/ui": "shadcn/ui",

      // State Management
      redux: "Redux",
      "@reduxjs/toolkit": "Redux Toolkit",
      recoil: "Recoil",
      zustand: "Zustand",
      jotai: "Jotai",
      mobx: "MobX",
      "@tanstack/react-query": "React Query",
      swr: "SWR",

      // Testing Frameworks
      jest: "Jest",
      vitest: "Vitest",
      "@testing-library/react": "React Testing Library",
      cypress: "Cypress",
      playwright: "Playwright",

      // Build Tools & Bundlers
      vite: "Vite",
      webpack: "Webpack",
      esbuild: "esbuild",
      turbopack: "Turbopack",
      "@babel/core": "Babel",

      // Form Handling
      "react-hook-form": "React Hook Form",
      formik: "Formik",
      "final-form": "Final Form",

      // Validation
      zod: "Zod",
      yup: "Yup",
      "class-validator": "Class Validator",

      // Database ORMs & Query Builders
      prisma: "Prisma",
      "@prisma/client": "Prisma",
      typeorm: "TypeORM",
      sequelize: "Sequelize",
      mongoose: "Mongoose",
      drizzle: "Drizzle ORM",

      // Authentication
      "next-auth": "NextAuth.js",
      "@auth0/auth0-react": "Auth0",
      firebase: "Firebase",
      supabase: "Supabase",

      // Development Tools
      prettier: "Prettier",
      eslint: "ESLint",
      typescript: "TypeScript",
      "@types/node": "Node.js with TypeScript",

      // Utilities
      lodash: "Lodash",
      "date-fns": "date-fns",
      axios: "Axios",
      moment: "Moment.js",
      ramda: "Ramda",
    };

    return [
      ...new Set(dependencies.map((dep) => frameworkMap[dep]).filter(Boolean)),
    ];
  }

  private generateAnalysisPrompt(data: {
    name: string;
    description: string;
    languages: { name: string; percentage: number }[];
    frameworks: string[];
  }): string {
    const mainLanguages = data.languages
      .filter((lang) => lang.percentage > 10)
      .map((lang) => lang.name)
      .join(", ");

    return (
      `This is an analysis of ${data.name}, ${data.description}. ` +
      `It's primarily built with ${mainLanguages}` +
      (data.frameworks.length ? ` using ${data.frameworks.join(", ")}` : "") +
      ". Based on this technical stack, here is a comprehensive analysis..."
    );
  }
}
