"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GradientText } from "../custom-ui/gradient-text";
import { Icons } from "../Icons";
import DemoCard from "./demo-card";

const HeroSection = () => {
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
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid min-h-screen grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-start justify-center space-y-8 pt-20 lg:pt-0">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 items-center rounded-full bg-primary/10 px-4 text-primary hover:bg-primary/20 transition-colors"
            >
              <Icons.gitLogo className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">Now on GitHub</span>
            </a>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Understand Repo with{" "}
              <GradientText animate>Semantic Searching</GradientText>
            </h1>

            <p className="text-lg text-muted-foreground">
              Transform complex repository into accessible, searchable knowledge
              landscapes.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group"
                onClick={handleGetStarted}
                disabled={status === "loading"}
              >
                Try {siteConfig.name} Free
                <Icons.arrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          <div className="relative lg:flex items-center justify-center hidden">
            <DemoCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
