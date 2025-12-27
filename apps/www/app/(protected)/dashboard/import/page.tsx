"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/routes";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Github, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

function ImportRepoPage() {
  const [url, setUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (url.length > 10) {
      setIsValidating(true);
      const timer = setTimeout(() => {
        setIsValidating(false);
        setIsValid(url.toLowerCase().includes("github.com/"));
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsValid(false);
      setIsValidating(false);
    }
  }, [url]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl md:text-4xl font-medium tracking-tight">
            Import Repository
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter a GitHub URL to start the analysis.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-500" />

          <div className="relative flex items-center bg-card border border-border rounded-lg px-4 h-12 transition-all group-focus-within:border-primary/50 group-focus-within:bg-card/80">
            <FaGithub className="w-4 h-4 text-muted-foreground mr-3" />
            <Input
              type="text"
              placeholder="github.com/username/repo"
              className="flex-1 bg-transparent border-none p-0 focus-visible:ring-0 text-sm placeholder:text-muted-foreground/40 h-full"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />

            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                {isValidating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center text-xs text-muted-foreground gap-1.5"
                  >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Validating</span>
                  </motion.div>
                )}
                {isValid && !isValidating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center text-xs text-emerald-500 font-medium"
                  >
                    Ready
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                size="sm"
                disabled={!isValid}
                onClick={() => router.push(ROUTES.DASHBOARD.IMPORT_REPO)}
                className="h-8 px-3 rounded-md text-xs gap-1.5 bg-primary hover:bg-primary/90 transition-all disabled:opacity-0 disabled:translate-x-2"
              >
                Import
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ImportRepoPage;
