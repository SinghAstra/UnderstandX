"use server";

import { Skeleton } from "@/components/ui/skeleton";
import { parseMdx } from "@/lib/markdown";
import { File } from "@prisma/client";
import React, { Suspense } from "react";

interface FileAnalysisProps {
  file: File;
}

const FileAnalysisSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Section 1: Introduction */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-2/3 rounded-sm" /> {/* Section title */}
        <Skeleton className="h-24 w-full rounded-sm" /> {/* Content block */}
      </div>

      {/* Section 2: Code Analysis */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-1/2 rounded-sm" /> {/* Section title */}
        <Skeleton className="h-16 w-full rounded-sm" /> {/* Text block */}
        <Skeleton className="h-32 w-full rounded-sm" /> {/* Code block */}
        <Skeleton className="h-20 w-full rounded-sm" /> {/* Text block */}
      </div>

      {/* Section 3: Recommendations */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-3/5 rounded-sm" /> {/* Section title */}
        <Skeleton className="h-36 w-full rounded-sm" /> {/* Content block */}
      </div>

      {/* Section 4: Conclusion */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-2/5 rounded-sm" /> {/* Section title */}
        <Skeleton className="h-20 w-full rounded-sm" /> {/* Content block */}
      </div>
    </div>
  );
};

const FileAnalysis = async ({ file }: FileAnalysisProps) => {
  const { content } = await parseMdx(
    file.analysis ?? "Analysis not generated. Please try again."
  );
  return <Suspense fallback={<FileAnalysisSkeleton />}>{content}</Suspense>;
};

export default FileAnalysis;
