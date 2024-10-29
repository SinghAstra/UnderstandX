"use client";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FadeIn } from "../animations/fade-in";
import { ScaleIn } from "../animations/scale-in";
import MaxWidthWrapper from "../global/max-width-wrapper";
import { Icons } from "../ui/Icons";
import { UserAvatar } from "../ui/user-avatar";

const Navbar = () => {
  const [scroll, setScroll] = useState(false);
  const session = useSession();
  const isAuthenticated = session.status === "authenticated" ? true : false;
  const isAuthenticating = session.status === "loading" ? true : false;

  const handleScroll = () => {
    if (window.scrollY > 8) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 h-14 w-full border-b border-border/40 bg-background/95 z-[99999] select-none overflow-hidden",
        scroll && "border-background/80 bg-background/40 backdrop-blur-md"
      )}
    >
      <MaxWidthWrapper className="flex items-center justify-between">
        <FadeIn delay={0.2}>
          <Link className="flex items-center space-x-2 text-primary" href={"/"}>
            <Icons.logo />
            <span className="text-lg font-medium">{siteConfig.name}</span>
          </Link>
        </FadeIn>

        <div className="hidden lg:flex items-center">
          <div className="flex gap-x-4 items-center">
            {isAuthenticating && (
              <div className="flex items-center gap-x-4">
                <div className="bg-gray-500 animate-pulse h-7 w-20 rounded-lg"></div>
                <div className="bg-gray-500 animate-pulse h-7 w-20 rounded-lg"></div>
              </div>
            )}
            {!isAuthenticating && !isAuthenticated && (
              <div className="flex items-center gap-x-4">
                <Link
                  href="/auth/sign-in"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-in"
                  className={buttonVariants({
                    size: "sm",
                    className: "bg-white",
                  })}
                >
                  Get Started
                  <Zap className="size-4 ml-1.5 text-orange-500 fill-orange-500" />
                </Link>
              </div>
            )}
            <UserAvatar />
            <ScaleIn delay={0.1}>
              <Link
                href={siteConfig.links.github}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    className: "rounded-full h-10 w-10 bg-neutral-900 ml-4",
                  })
                )}
                target="_blank"
              >
                <Icons.gitHub className="h-5 w-5" />
              </Link>
            </ScaleIn>
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Navbar;
