"use client";

import { siteConfig } from "@/config/site";
import { SessionProvider } from "next-auth/react";
import { ReactNode, Suspense } from "react";
import MaskedGridBackground from "../component-x/masked-grid-background";
import { SidebarProvider } from "../ui/sidebar";

interface ProviderProps {
  children: ReactNode;
}

const LoadingFallback = () => {
  return (
    <div className="h-screen overflow-hidden flex  gap-4 items-center text-center justify-center relative px-4 bg-background">
      <MaskedGridBackground />

      <p className="text-2xl tracking-tight text-muted-foreground font-medium">
        {siteConfig.name}
      </p>
    </div>
  );
};

const Providers = ({ children }: ProviderProps) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SidebarProvider>
        <SessionProvider>{children}</SessionProvider>
      </SidebarProvider>
    </Suspense>
  );
};

export default Providers;
