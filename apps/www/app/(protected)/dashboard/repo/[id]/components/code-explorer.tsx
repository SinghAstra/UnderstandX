"use client";
import { Badge } from "@/components/ui/badge";
import { Box, ChevronRight, FileCode, Folder, Zap } from "lucide-react";
import { useState } from "react";

export function CodeExplorer({ repoId }: { repoId: string }) {
  const [selectedFile, setSelectedFile] = useState<any>(null);

  return (
    <div className="grid grid-cols-12 h-full">
      {/* LEFT: Skeleton (Directories & Files) */}
      <aside className="col-span-3 border-r bg-muted/30 p-4 overflow-y-auto">
        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4 tracking-wider">
          Skeleton
        </h3>
        {/* Placeholder for recursive tree logic */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-1 hover:bg-secondary rounded cursor-pointer text-sm">
            <Folder className="w-4 h-4 text-blue-400" /> src
          </div>
          <div className="flex items-center gap-2 p-1 pl-4 hover:bg-secondary rounded cursor-pointer text-sm">
            <FileCode className="w-4 h-4 text-emerald-400" /> main.ts
          </div>
        </div>
      </aside>

      {/* CENTER: Metadata (Symbols & Implementation) */}
      <section className="col-span-9 p-8 overflow-y-auto bg-background">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Zap className="text-amber-500" /> Nervous System Details
            </h2>
            <p className="text-muted-foreground">
              Select a file to view exported symbols and resolved dependencies.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Symbols Table Verification */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Box className="w-4 h-4" /> Symbols (Exports)
              </h4>
              <div className="border rounded-lg divide-y">
                <div className="p-3 text-sm font-mono text-emerald-600 bg-emerald-50/50">
                  export function init()
                </div>
              </div>
            </div>

            {/* Dependencies Table Verification */}
            <div className="space-y-4">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4" /> Dependencies (Imports)
              </h4>
              <div className="border rounded-lg divide-y">
                <div className="p-3 text-sm flex justify-between items-center">
                  <span className="font-mono">@/database</span>
                  <Badge
                    variant="outline"
                    className="text-emerald-500 border-emerald-500"
                  >
                    Resolved
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
