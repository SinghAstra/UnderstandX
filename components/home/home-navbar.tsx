"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AvatarMenu } from "../custom-ui/avatar-menu";
import SignInButton from "../custom-ui/sign-in-button";
import { Skeleton } from "../ui/skeleton";

export function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-200 py-2 px-4 bg-transparent",
        scrolled && "backdrop-blur-sm border-b border-border/40"
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity ml-2"
        >
          <span className="tracking-wide text-2xl font-medium">
            {siteConfig.name}
          </span>
        </Link>

        {status === "loading" ? (
          <Skeleton className="h-10 w-10 rounded-full  border-primary border-2" />
        ) : session?.user ? (
          <AvatarMenu />
        ) : (
          <SignInButton />
        )}
      </nav>
    </header>
  );
}
