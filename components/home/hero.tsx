"use client";

import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FadeInUp } from "../animation/fade-in-up";
import { GradientText } from "../custom-ui/gradient-text";
import { Icons } from "../Icons";
import { Button, buttonVariants } from "../ui/button";

export function Hero() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleGetStarted = () => {
    if (status === "loading") {
      toast({
        title: "Authenticating",
        description: "Checking your authentication status...",
      });
      return;
    }

    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
      return;
    }

    if (status === "authenticated") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center">
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center space-y-8 text-center">
          <FadeInUp>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={siteConfig.links.github}
                className={cn(buttonVariants({ variant: "outline" }))}
                target="_blank"
              >
                <Icons.gitLogo />
                Star on GitHub
              </Link>
              <Link
                href={siteConfig.links.twitter}
                className={cn(buttonVariants({ variant: "outline" }))}
                target="_blank"
              >
                <Icons.twitter />
                Follow Updates
              </Link>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Understand Repo with
                <br />
                <GradientText animate>Semantic Searching</GradientText>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Transform complex repositories into accessible, searchable
                knowledge landscapes.
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <Button
              onClick={handleGetStarted}
              disabled={status === "loading"}
              className="flex items-center gap-2 h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span className="text-base">Get Started</span>
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Icons.arrowRight />
              </motion.div>
            </Button>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}
