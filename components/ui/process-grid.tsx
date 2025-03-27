"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  BookOpenText,
  Cpu,
  Link2Icon,
  LucideIcon,
  SearchIcon,
  SparklesIcon,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import RepoProcessedBackground from "../background/repo-processed";
import RepoProcessingBackground from "../background/repo-processing";
import BackgroundTerminal from "../background/terminal";

export const Steps = (href: string) => [
  {
    Icon: Link2Icon,
    name: "Provide URL",
    description: "Provide URL to Public Github Repo you want to understand",
    href,
    cta: "Get Started",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute top-10  inset-x-10 origin-top rounded-none rounded-tl-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] group-hover:scale-105  ">
        <div
          className={`bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl border shadow-lg transition-all duration-600 `}
        >
          <div className="flex items-center border-b px-4 py-3">
            <SearchIcon className="w-5 h-5 text-muted-foreground mr-2" />
            <input
              type="url"
              placeholder="Paste Your Github repository URL..."
              className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-base placeholder:text-muted-foreground"
            />
            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <div className="border-t px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <SparklesIcon className="w-4 h-4" />
              <span>Uses GitHub API</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" type="submit">
                Analyze
              </Button>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Cpu,
    name: "Repo Processing",
    description:
      "This might take a few minutes but you will end up saving hours",
    href,
    cta: "Get Started",
    className: "col-span-3 lg:col-span-1 ",
    background: <RepoProcessingBackground />,
  },
  {
    Icon: Terminal,
    name: "Real Time Logs",
    description:
      "While Repo Processing Takes Place, logs will keep you updated.",
    href,
    cta: "Get Started",
    className: "col-span-3 lg:col-span-2 max-w-full overflow-hidden",
    background: <BackgroundTerminal />,
  },
  {
    Icon: BookOpenText,
    name: "Start Reading",
    description: "Repository has been analyzed, Happy reading.",
    className: "col-span-3 lg:col-span-1",
    href,
    cta: "Get Started",
    background: <RepoProcessedBackground />,
  },
];

const ProcessGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const ProcessCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: LucideIcon;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between border border-border/60 overflow-hidden rounded-xl ",
      className
    )}
  >
    <div>{background}</div>

    <div className=" z-10 flex flex-col gap-1 p-6 transition-all duration-300 translate-y-10  group-hover:translate-y-0 bg-gradient-to-b from-black/0 via-black/40 via-black/60 to-black/80">
      <Icon className="h-12 w-12 origin-left text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-normal text-neutral-300">{name}</h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
      <div
        className={cn(
          " flex w-full translate-y-10 flex-row items-center py-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 "
        )}
      >
        <Link
          href={href}
          className={
            "py-1 px-2 border rounded-md tracking-wide flex items-center gap-1 hover:bg-muted/40"
          }
        >
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  </div>
);

export { ProcessCard, ProcessGrid };
