"use client";

import { Icons } from "@/components/Icons";
import { AvatarMenu } from "@/components/layout/avatar-menu";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Link href="/">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icons.logo className="h-8 w-8 text-primary" />
              <span className="font-semibold text-lg">{siteConfig.name}</span>
            </div>
            <AvatarMenu />
          </div>
        </header>
      </Link>

      {/* Main Content */}
      <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center text-center space-y-8">
          <Icons.logo className="h-24 w-24 text-primary animate-pulse" />

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-destructive">Error</h1>
            <h2 className="text-2xl font-semibold">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md">
              An unexpected error has occurred. Please try again later.
            </p>
          </div>

          <Button onClick={reset} className="space-x-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </main>
    </div>
  );
}
