import { Icons } from "@/components/Icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BellIcon,
  CheckCircle2,
  ChevronRight,
  Clock,
  CopyIcon,
  Cross,
  TerminalIcon,
} from "lucide-react";
import React from "react";

const RepositoryProcessingTerminal = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Split Container */}
      <div className="grid grid-cols-5 gap-6 bg-background rounded-lg border shadow-xl overflow-hidden">
        {/* Left Panel - Status Overview */}
        <div className="col-span-2 border-r p-6 space-y-6">
          {/* Repository Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Icons.gitLogo className="w-5 h-5" />
              <span className="text-sm font-semibold">username/repository</span>
            </div>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
              Processing
            </Badge>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Processing Timeline
            </h3>

            {/* Completed Step */}
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    Repository Processing
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-500"
                  >
                    Complete
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  Completed in 45s
                </span>
              </div>
            </div>

            {/* Current Step */}
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Chunk Generation</span>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/10 text-blue-500"
                  >
                    In Progress
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full w-1/2" />
                </div>
                <span className="text-xs text-muted-foreground">
                  50% complete
                </span>
              </div>
            </div>

            {/* Pending Step */}
            <div className="flex items-start space-x-3 opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-muted mt-0.5" />
              <div className="space-y-1">
                <span className="text-sm font-medium">
                  Embedding Generation
                </span>
                <span className="text-xs text-muted-foreground">Queued</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <BellIcon className="mr-2 h-4 w-4" />
              Notify on completion
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive"
            >
              <Cross className="mr-2 h-4 w-4" />
              Cancel Processing
            </Button>
          </div>

          {/* Processing Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              Started 2m ago
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <AlertCircle className="mr-2 h-4 w-4" />
              Estimated 8m remaining
            </div>
          </div>
        </div>

        {/* Right Panel - Terminal Output */}
        <div className="col-span-3 bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TerminalIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Build Output
              </span>
            </div>
            <Button variant="ghost" size="sm">
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>

          <div className="font-mono text-sm space-y-2 text-muted-foreground">
            <div className="flex items-start space-x-2">
              <ChevronRight className="w-4 h-4 mt-1 text-blue-500" />
              <span>Cloning repository...</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 mt-1 text-green-500" />
              <span>Repository cloned successfully</span>
            </div>
            <div className="flex items-start space-x-2">
              <ChevronRight className="w-4 h-4 mt-1 text-blue-500" />
              <span>Analyzing repository structure...</span>
            </div>
            <div className="flex items-start space-x-2">
              <ChevronRight className="w-4 h-4 mt-1 text-blue-500" />
              <div className="space-y-1">
                <span>Generating chunks...</span>
                <div className="text-xs">
                  ├─ Processing files: 45/100 └─ Current file:
                  src/components/layout.tsx
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryProcessingTerminal;
