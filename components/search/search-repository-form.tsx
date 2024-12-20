"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { validateGithubUrl } from "@/lib/utils/validate-github-url";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, ClockIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { Icons } from "../Icons";

export function SearchRepositoryForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateGithubUrl(url);

    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError(undefined);
    setIsProcessing(true);

    try {
      // Simulated async processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Actual repository processing logic
      setIsSuccess(true);

      // Reset after success
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(false);
        setUrl("");
      }, 2000);
    } catch (err) {
      setError("Failed to process repository");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl backdrop-blur-lg rounded-2xl border shadow-2xl p-8 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icons.gitLogo
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                error
                  ? "text-red-500 group-focus-within:text-gray-400"
                  : "text-gray-400"
              )}
            />
          </div>
          <input
            type="url"
            placeholder="https://github.com/username/repository"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(undefined);
            }}
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-lg border bg-white/5 text-foreground",
              "placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-all duration-200",
              error
                ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                : "border-gray-700 hover:border-primary/50"
            )}
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm mt-2 flex items-center"
            >
              <span className="mr-2">⚠️</span> {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className={cn(
            "w-full relative overflow-hidden",
            isSuccess && "bg-green-500 hover:bg-green-600"
          )}
          disabled={isProcessing || isSuccess}
        >
          {isSuccess ? (
            <div className="flex items-center">
              <CheckIcon className="mr-2 h-5 w-5" />
              Repository Queued
            </div>
          ) : isProcessing ? (
            <div className="flex items-center">
              <SearchIcon className="mr-2 h-4 w-4 animate-spin" />
              Processing Repository...
            </div>
          ) : (
            "Process Repository"
          )}
        </Button>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="cursor-help">
                  <SparklesIcon className="mr-2 h-3 w-3" />
                  AI-Powered
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Our AI analyzes repository structure and content
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4" />
              Processing: 5-10 minutes
            </div>
          </div>

          <div className="flex items-center space-x-2 opacity-70">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="w-2 h-2 bg-purple-500 rounded-full" />
          </div>
        </div>
      </form>
    </div>
  );
}
