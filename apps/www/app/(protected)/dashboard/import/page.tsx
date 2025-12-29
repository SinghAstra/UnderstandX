"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ImportRepoInput,
  ImportRepoResponse,
  importRepoSchema,
} from "@understand-x/shared";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

function ImportRepoPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ImportRepoInput>({
    resolver: zodResolver(importRepoSchema),
    mode: "onSubmit",
  });

  const repoUrlValue = watch("repoUrl");

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      values: ImportRepoInput
    ): Promise<ImportRepoResponse> => {
      const { data } = await axios.post<ImportRepoResponse>(
        "/api/repos/import",
        values
      );
      return data;
    },
    onSuccess: (data) => {
      router.push(`/dashboard/repo/${data.repoId}/console`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  const placeholders = useMemo(
    () => [
      "https://github.com/vercel/next.js",
      "https://github.com/shadcn/ui",
      "https://github.com/facebook/react",
    ],
    []
  );

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const onSubmit = (data: ImportRepoInput) => {
    mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight">
            Import Repository
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter a GitHub URL to start the analysis.
          </p>
        </div>

        <div className="space-y-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative group flex items-center border rounded px-4 h-12 transition-all focus-within:border-primary/50"
          >
            <FaGithub className="w-4 h-4 text-muted-foreground mr-3" />
            <div className="relative flex-1 h-full flex items-center">
              <AnimatePresence mode="wait">
                {!repoUrlValue && (
                  <motion.span
                    key={placeholders[placeholderIndex]}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 text-sm text-muted-foreground/40 pointer-events-none select-none"
                  >
                    {placeholders[placeholderIndex]}
                  </motion.span>
                )}
              </AnimatePresence>

              <Input
                {...register("repoUrl")}
                type="text"
                autoComplete="off"
                className="flex-1 bg-transparent border-none p-0 focus-visible:ring-0 text-sm h-full relative z-10"
                autoFocus
              />
            </div>

            <div className="p-2">
              <Button
                type="submit"
                size="sm"
                disabled={isPending}
                className="h-8 px-3 rounded gap-1.5 bg-primary hover:bg-primary/90 transition-all duration-300 min-w-20"
              >
                {isPending ? (
                  <div className="flex gap-1.5 items-center">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Wait...
                  </div>
                ) : (
                  <div className="flex gap-1.5 items-center">
                    Import
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </Button>
            </div>
          </form>

          <AnimatePresence>
            {errors.repoUrl && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-destructive px-1 ml-auto text-right"
              >
                {errors.repoUrl.message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default ImportRepoPage;
