"use client";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { VerticalAnimationContainer } from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import { Icons } from "../ui/Icons";
import { UserAvatar } from "../user-avatar";

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
        "sticky top-0 inset-x-0 h-14 w-full border-b border-transparent z-[99999] select-none",
        scroll && "border-background/80 bg-background/40 backdrop-blur-md"
      )}
    >
      <VerticalAnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between">
          <Link className="flex items-center space-x-2 text-primary" href={"/"}>
            <Icons.logo />
            <span className="text-lg font-medium">{siteConfig.name}</span>
          </Link>

          <div className="hidden lg:flex items-center">
            <div className="flex gap-x-4">
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
            </div>
          </div>
        </MaxWidthWrapper>
      </VerticalAnimationContainer>
    </header>
  );
};

export default Navbar;
