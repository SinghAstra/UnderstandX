"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Code2, Plus } from "lucide-react";
import { AvatarMenu } from "../custom-ui/avatar-menu";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">NavX</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Connect New Repository</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Connect New Repository</TooltipContent>
          </Tooltip>
          <AvatarMenu />
        </div>
      </div>
    </nav>
  );
}
