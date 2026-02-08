import { Badge } from "@/components/ui/badge";
import { FaGithub } from "react-icons/fa";

export function RepoHeader({ repo, audit }: any) {
  const statusColors = {
    QUEUED: "bg-slate-500",
    PROCESSING: "bg-amber-500 animate-pulse",
    COMPLETED: "bg-emerald-500",
    FAILED: "bg-rose-500",
  };

  return (
    <header className="border-b bg-background p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaGithub className="w-5 h-5" />
          {repo.name}
        </h1>
        <Badge
          className={statusColors[repo.status as keyof typeof statusColors]}
        >
          {repo.status}
        </Badge>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground uppercase font-semibold">
            Nervous System Health
          </span>
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${audit.score}%` }}
              />
            </div>
            <span className="text-sm font-mono">
              {audit.resolved}/{audit.total}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
