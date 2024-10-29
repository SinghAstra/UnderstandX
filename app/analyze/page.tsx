"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { TextGenerateEffect } from "@/components/animations/text-generate-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RepoCard } from "@/components/ui/repo-card";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  return (
    <main className="container flex min-h-screen flex-col gap-8 py-24">
      <FadeIn>
        <h1 className="text-center text-4xl font-bold tracking-tight">
          <TextGenerateEffect words="Analyze Your Repository" />
        </h1>
        <p className="mt-4 text-center text-muted-foreground">
          Enter your GitHub repository URL to begin the analysis
        </p>
      </FadeIn>

      <FadeIn delay={0.2} className="mx-auto w-full max-w-2xl">
        <div className="flex gap-4">
          <Input
            placeholder="https://github.com/username/repository"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12"
          />
          <Button
            className="h-12 px-6"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Analyze
          </Button>
        </div>
      </FadeIn>

      <motion.div layout className="grid gap-6 md:grid-cols-2">
        <RepoCard
          name="next.js"
          description="The React Framework for the Web"
          language="TypeScript"
          stars={12500}
          forks={3200}
          className="md:col-span-2"
        />
        <RepoCard
          name="react"
          description="A JavaScript library for building user interfaces"
          language="JavaScript"
          stars={15800}
          forks={4100}
        />
        <RepoCard
          name="tailwindcss"
          description="A utility-first CSS framework"
          language="CSS"
          stars={9200}
          forks={2800}
        />
      </motion.div>
    </main>
  );
}
