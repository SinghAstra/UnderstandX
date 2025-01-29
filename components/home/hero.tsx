"use client";

import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
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
    <div className="max-w-3xl flex flex-col items-center text-center gap-8">
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center justify-center text-center gap-8 max-w-3xl">
          <h1 className="text-4xl font-bold  sm:text-5xl md:text-6xl lg:text-7xl">
            <GradientText variant="secondary" animate>
              Simplifying
            </GradientText>{" "}
            Understanding
            <br />
            <GradientText variant="secondary" animate>
              Github Repo
            </GradientText>
          </h1>

          <Button
            onClick={handleGetStarted}
            disabled={status === "loading"}
            variant={"outline"}
            size={"lg"}
          >
            Get Started <ArrowRight />
          </Button>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center text-center gap-8 max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl ">
            Perform{" "}
            <GradientText variant="accent" animate>
              Semantic Searching
            </GradientText>{" "}
            on Github Repo on basis of{" "}
            <GradientText variant="accent" animate>
              functionality
            </GradientText>{" "}
            of the code.
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGetStarted}
              disabled={status === "loading"}
              variant={"outline"}
              size={"lg"}
            >
              Get Started <ArrowRight />
            </Button>
            <Link
              href={siteConfig.links.twitter}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              target="_blank"
            >
              <Icons.twitter />
              Follow Updates
            </Link>
          </div>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center text-center gap-8 max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Find{" "}
            <GradientText variant="success" animate>
              Functionalities
            </GradientText>{" "}
            Implemented in Github Repo and their{" "}
            <GradientText variant="success" animate>
              Respective Code
            </GradientText>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGetStarted}
              disabled={status === "loading"}
              variant={"outline"}
              size={"lg"}
              className="space-x-2"
            >
              Get Started <ArrowRight />
            </Button>
            <Link
              href={siteConfig.links.github}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              target="_blank"
            >
              <Icons.gitLogo />
              Star on GitHub
            </Link>
          </div>
        </div>
      </FadeInUp>
      <FadeInUp delay={0.4}>
        <div className="min-h-screen flex flex-col items-center text-center gap-8 max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={siteConfig.links.twitter}
              className={cn(buttonVariants({ variant: "outline" }))}
              target="_blank"
            >
              <Icons.twitter />
              Follow Updates
            </Link>
            <Link
              href={siteConfig.links.github}
              className={cn(buttonVariants({ variant: "outline" }))}
              target="_blank"
            >
              <Icons.gitLogo />
              Star on GitHub
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Provides{" "}
            <GradientText variant="warning" animate>
              Summary
            </GradientText>{" "}
            of Code{" "}
            <GradientText variant="warning" animate>
              Files and Directories
            </GradientText>
          </h1>
          <Button
            onClick={handleGetStarted}
            disabled={status === "loading"}
            variant={"outline"}
            size={"lg"}
            className="space-x-2"
          >
            Get Started <ArrowRight />
          </Button>
        </div>
      </FadeInUp>
    </div>
  );
}
