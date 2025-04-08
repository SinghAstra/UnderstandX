"use server";

import { parseMdx } from "@/lib/markdown";

interface RepoOverviewProps {
  overview: string | null;
}

const RepoOverview = async ({ overview }: RepoOverviewProps) => {
  const { content } = await parseMdx(
    overview ?? "Overview not generated. Please try again!"
  );
  return (
    <div className="w-full flex-1 p-3 ml-96">
      <div className="border rounded-md px-4 py-3 ">{content}</div>
    </div>
  );
};

export default RepoOverview;
