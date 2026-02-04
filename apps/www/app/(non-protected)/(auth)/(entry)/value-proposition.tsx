"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";

export function ValueProposition() {
  return (
    <div className="max-w-lg flex items-center justify-center mx-auto">
      <div className="relative">
        <div
          aria-hidden="true"
          className="
          absolute -top-16 -left-16 text-[18rem]  
          leading-none font-serif text-foreground/5  
          z-0
        "
        >
          &ldquo;
        </div>
        <blockquote className="space-y-4 **relative z-10**">
          <p className="text-2xl md:text-3xl leading-snug font-semibold text-balance tracking-tight">
            Trying to navigate a 50k line legacy repo used to take me days. With{" "}
            <span className="text-primary">{siteConfig.name}</span>, I
            understood the entire architecture in under five minutes. It&apos;s
            pure magic.
          </p>
          <div className="flex items-center gap-3 pt-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/assets/user.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base leading-none">
                Sarah Johnson
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Senior Software Engineer
              </p>
            </div>
          </div>
        </blockquote>
      </div>
    </div>
  );
}
