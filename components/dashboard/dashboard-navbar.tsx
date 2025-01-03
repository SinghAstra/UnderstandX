"use client";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { Plus } from "lucide-react";
import { AvatarMenu } from "../custom-ui/avatar-menu";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-loose font-semibold">
            {siteConfig.name}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline">
            <Plus className="h-5 w-5" />
            Connect New Repository
          </Button>
          <AvatarMenu />
        </div>
      </div>
    </nav>
  );
}
