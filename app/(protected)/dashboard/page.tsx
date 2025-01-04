"use client";

import { Button } from "@/components/ui/button";
import { parseGithubUrl } from "@/lib/utils/github";
import { cn } from "@/lib/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function CommandPaletteRepoForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = parseGithubUrl(url);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    setIsProcessing(true);

    try {
      const response = await fetch("/api/repository/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubUrl: url }),
      });

      const data = await response.json();

      setIsSuccess(true);

      router.push(`/repository/${data.repositoryId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process repository"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="m-2">
      <div className="relative bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl border shadow-lg">
        {/* Search Header */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center border-b px-4 py-3">
            <SearchIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <input
              ref={inputRef}
              type="url"
              placeholder="Paste Your Github repository URL..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(undefined);
              }}
              disabled={isProcessing}
              className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-base placeholder:text-muted-foreground"
            />
            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          {/* Recent/Popular Repositories */}
          {/* <div className="p-2 max-h-72 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5">
            Popular repositories
          </div>
          {["facebook/react", "vercel/next.js", "tailwindlabs/tailwindcss"].map(
            (repo) => (
              <button
                key={repo}
                onClick={() => setUrl(`https://github.com/${repo}`)}
                className="flex items-center gap-2 w-full rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                <Icons.gitLogo className="w-4 h-4" />
                {repo}
              </button>
            )
          )}
        </div> */}

          {/* Action Footer */}
          <div className="border-t px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <SparklesIcon className="w-4 h-4" />
              <span>Uses GitHub API</span>
            </div>
            <Button
              size="sm"
              disabled={!url || isProcessing || isSuccess}
              // onClick={handleSubmit}
              type="submit"
              className={cn(
                "relative overflow-hidden",
                isSuccess && "bg-green-500 hover:bg-green-600"
              )}
            >
              {isSuccess ? (
                <div className="flex items-center">
                  <CheckIcon className="mr-2 h-5 w-5" />
                  Redirecting...
                </div>
              ) : isProcessing ? (
                <div className="flex items-center">
                  <SearchIcon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </form>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-2 flex items-center"
          >
            <span className="mx-2">⚠️</span> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DashboardPage() {
  return <CommandPaletteRepoForm />;
}
