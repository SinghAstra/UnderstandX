"use client";

import { Typography } from "@/components/ui/typography";
import { Markdown } from "@/lib/markdown";

interface RepoOverviewProps {
  overview: string;
}

const RepoOverview = ({ overview }: RepoOverviewProps) => {
  return (
    <div className="w-full flex-1 p-3 ml-96">
      <div className="border rounded-md px-4 py-3 ">
        <Typography>
          <Markdown>{overview}</Markdown>
        </Typography>
      </div>
    </div>
  );
};

export default RepoOverview;
