"use client";

import { useRepoSocket } from "@/hooks/use-repo-socket";
import { useQuery } from "@tanstack/react-query";
import { CodeExplorer } from "./components/code-explorer";
import { RepoHeader } from "./components/repo-header";
import { TerminalView } from "./components/terminal-view";

export default function RepoClientPage({ repoId, initialData, audit }: any) {
  useRepoSocket(repoId);

  const { data: repo } = useQuery({
    queryKey: ["repo", repoId],
    initialData: initialData,
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <RepoHeader repo={repo} audit={audit} />

      <main className="flex-1 relative">
        {repo.status === "COMPLETED" ? (
          <CodeExplorer repoId={repoId} />
        ) : (
          <TerminalView logs={repo.logs} />
        )}
      </main>
    </div>
  );
}
