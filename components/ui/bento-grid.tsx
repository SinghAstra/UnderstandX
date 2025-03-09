import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CalendarIcon,
  Link2Icon,
  SearchIcon,
  SparklesIcon,
  WaypointsIcon,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Integrations } from "./integrations";

export const Steps = (href: string) => [
  {
    Icon: Link2Icon,
    name: "Provide URL",
    description: "Provide URL to Public Github Repo you want to understand",
    href,
    cta: "Get started",
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
    Icon: SearchIcon,
    name: "Repo Processing",
    description: "This might take a few minutes but you will be saving hours",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Command className="absolute right-10 top-10 w-[70%] origin-to translate-x-0 border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:-translate-x-10 p-2">
        <Input placeholder="Type to search..." />
        <div className="mt-1 cursor-pointer">
          <div className="px-4 py-2 hover:bg-muted rounded-md">
            linkify.io/hdf00c
          </div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">
            linkify.io/sdv0n0
          </div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">
            linkify.io/03gndo
          </div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">
            linkify.io/09vmmw
          </div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">
            linkify.io/s09vws
          </div>
          <div className="px-4 py-2 hover:bg-muted rounded-md">
            linkify.io/sd8fv5
          </div>
        </div>
      </Command>
    ),
  },
  {
    Icon: WaypointsIcon,
    name: "Connect your apps",
    description: "Integrate with your favorite apps and services.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2 max-w-full overflow-hidden",
    background: (
      <Integrations className="absolute right-2 pl-28 md:pl-0 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: CalendarIcon,
    name: "Calendar",
    description: "Keep track of your links with our calendar view.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top rounded-md border border-border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
      />
    ),
  },
];

const BentoGrid = ({
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

const BentoCard = ({
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
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between border border-border/60 overflow-hidden rounded-xl",
      "bg-black [box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-normal text-neutral-300">{name}</h3>
      <p className="max-w-lg text-neutral-400">{description}</p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Link
        href={href}
        className={buttonVariants({
          variant: "outline",
          className: "tracking-wider",
        })}
      >
        {cta}
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Link>
    </div>
    <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />
  </div>
);

export { BentoCard, BentoGrid };
