import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { env } from "@/env";
import { prisma } from "@understand-x/database";
import { notFound } from "next/navigation";
import { LogConsoleClient } from "./log-console-client";

interface ConsolePageProps {
  params: Promise<{ id: string }>;
}

export default async function ConsolePage({ params }: ConsolePageProps) {
  // 1. Unwrap the params Promise
  const { id } = await params;
  const repo = await prisma.repository.findUnique({
    where: { id },
    include: {
      logs: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!repo) notFound();

  // Convert Date objects to strings for the client component
  const initialLogs = repo.logs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-500">
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 border border-border/50">
            <AvatarImage src={repo.avatarUrl || ""} />
            <AvatarFallback className="bg-muted text-xs">
              {repo.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold tracking-tight">
                {repo.name}
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] h-4 px-1.5 bg-primary/5 text-primary border-primary/20 uppercase tracking-widest font-bold"
              >
                {repo.status}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground/60 font-mono truncate max-w-50 sm:max-w-md">
              {repo.url}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end mr-2">
            <span className="text-[9px] uppercase font-bold text-muted-foreground/40 leading-none mb-1">
              Stream
            </span>
            <span className="text-[11px] font-medium text-primary">
              Live logs
            </span>
          </div>
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        </div>
      </header>
      <main className="flex-1 overflow-hidden p-4 sm:p-6">
        <LogConsoleClient
          repoId={id}
          initialData={initialLogs}
          apiUrl={env.API_URL}
        />
      </main>
    </div>
  );
}
