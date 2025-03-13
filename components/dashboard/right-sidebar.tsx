"use client";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function RightSidebar() {
  return (
    <div className="w-80 bg-background py-2 pr-2 ">
      <div className="border py-2 px-4 rounded-md flex flex-col gap-1">
        <h3>Follow For Updates</h3>
        <p className="text-muted-foreground text-sm">
          More tools are being developed to enhance your development workflow.
        </p>
        <a
          className={cn(
            buttonVariants({
              variant: "outline",
              className: "w-full mt-2 tracking-wide font-normal",
            })
          )}
          href={siteConfig.links.twitter}
          target="_blank"
        >
          Connect on X
        </a>
      </div>
    </div>
  );
}
