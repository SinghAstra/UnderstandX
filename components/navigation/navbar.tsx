"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import AnimationContainer from "../global/animation-container";
import MaxWidthWrapper from "../global/max-width-wrapper";
import { AvatarMenu } from "../ui/avatar-menu";
import SignInButton from "../ui/sign-in";
import { Skeleton } from "../ui/skeleton";

const Navbar = () => {
  const { data: session, status } = useSession();

  const [scroll, setScroll] = useState(false);

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
        "fixed top-0 inset-x-0 h-14 z-[99] border-b border-transparent backdrop-blur-lg",
        scroll && "border-background/80 bg-background/40 "
      )}
    >
      <AnimationContainer reverse delay={0.2} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link href="/">
              <span className="text-3xl font-normal tracking-wider">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center">
            {status === "loading" ? (
              <Skeleton className="h-10 w-10 rounded-full  border-primary border-2" />
            ) : session?.user ? (
              <AvatarMenu />
            ) : (
              <SignInButton />
            )}
          </div>
        </MaxWidthWrapper>
      </AnimationContainer>
    </header>
  );
};

export default Navbar;
