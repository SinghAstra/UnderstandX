"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Search } from "lucide-react";
import { useState } from "react";

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
  error?: string;
}

export function URLInput({ onAnalyze, isAnalyzing, error }: URLInputProps) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validateURL = (input: string) => {
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    return githubRegex.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateURL(url)) {
      onAnalyze(url);
    } else {
      setIsValid(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      <form onSubmit={handleSubmit} className="flex gap-4">
        <Input
          placeholder="https://github.com/username/repository"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setIsValid(true);
          }}
          className={cn(
            "h-12",
            !isValid && "border-red-500 focus-visible:ring-red-500"
          )}
        />
        <Button
          type="submit"
          className="h-12 px-6"
          disabled={isAnalyzing || !url}
        >
          {isAnalyzing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Analyze
        </Button>
      </form>

      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please enter a valid GitHub repository URL
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </motion.div>
  );
}
