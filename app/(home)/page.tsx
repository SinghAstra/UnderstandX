"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { ScaleIn } from "@/components/animations/scale-in";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import GetStarted from "./GetStarted";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black">
      <section className="container flex flex-col items-center justify-center gap-4 pt-28 pb-8 md:pt-36">
        <FadeIn>
          <Link
            href={siteConfig.links.twitter}
            target="_blank"
            className="relative inline-flex h-10 overflow-hidden rounded-full p-[1.5px] focus:outline-none select-none"
          >
            <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--primary-foreground))_50%,hsl(var(--primary))_100%)]" />

            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[hsl(var(--background))] px-4 py-1 text-sm font-medium text-[hsl(var(--foreground))] backdrop-blur-3xl">
              Follow Along on twitter
              <Icons.next className="ml-2 size-6 animate-moveLeftRight" />
            </span>
          </Link>
        </FadeIn>
        <FadeIn className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Visualize Schema with
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h1>
        </FadeIn>

        <FadeIn
          className="max-w-[42rem] text-center leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          delay={0.2}
        >
          Instantly visualize database schemas, generate comprehensive prompts
          for GitHub repositories, and collaborate with AI to supercharge your
          development workflow.
        </FadeIn>

        <div className="flex items-center justify-center gap-4">
          <ScaleIn>
            <GetStarted />
          </ScaleIn>
          <ScaleIn>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </ScaleIn>
        </div>
      </section>
    </main>
  );
}
