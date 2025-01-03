"use client";

import { siteConfig } from "@/config/site";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { AvatarMenu } from "../custom-ui/avatar-menu";
import SignInButton from "../custom-ui/sign-in-button";
import { Icons } from "../Icons";
import { Skeleton } from "../ui/skeleton";

export function DashboardNavbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-border/40 bg-card backdrop-blur-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity ml-2"
        >
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="tracking-wide text-2xl font-medium">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <Skeleton className="h-10 w-10 rounded-full  border-primary border-2" />
          ) : session?.user ? (
            <AvatarMenu />
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
}
