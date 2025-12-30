"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogResponse, SOCKET_EVENTS } from "@understand-x/shared";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

interface Props {
  repoId: string;
  initialData: LogResponse[];
  apiUrl: string;
}

export function LogConsoleClient({ repoId, initialData, apiUrl }: Props) {
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryKey = ["logs", repoId];

  const { data: logs } = useQuery<LogResponse[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/repos/${repoId}/logs`);
      const result = await res.json();
      return result.data;
    },
    initialData,
  });

  useEffect(() => {
    const socket = io(apiUrl, { query: { repoId } });

    socket.on(SOCKET_EVENTS.LOG_UPDATED, (newLog: LogResponse) => {
      queryClient.setQueryData(queryKey, (old: LogResponse[] | undefined) =>
        old ? [...old, newLog] : [newLog]
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [repoId, queryClient, apiUrl]);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={scrollRef}
      className="h-full w-full rounded-lg border border-border/40 bg-muted/30 shadow-2xl overflow-y-auto"
    >
      <div className="p-4 font-mono text-sm leading-relaxed space-y-0.5">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={cn(
              "flex gap-3 px-2 py-1 rounded transition-all duration-300 group hover:bg-muted/50",
              i === logs.length - 1 &&
                "animate-in fade-in slide-in-from-left-1 duration-500"
            )}
          >
            {/* Timestamp */}
            <span className="text-muted-foreground/30 shrink-0 select-none group-hover:text-muted-foreground/50 transition-all duration-300">
              {new Date(log.createdAt).toLocaleTimeString([], {
                hour12: false,
              })}
            </span>

            {/* Logic-colored Vertical Bar */}
            <div
              className={cn(
                "w-px shrink-0 rounded-full my-1 opacity-40",
                log.status === "SUCCESS" && "bg-emerald-500",
                log.status === "FAILED" && "bg-destructive",
                log.status === "PROCESSING" && "bg-primary"
              )}
            />

            {/* Content */}
            <div className="flex gap-2 min-w-0">
              <span className="text-muted-foreground/20 shrink-0 select-none">
                $
              </span>
              <span
                className={cn(
                  "wrap-break-word",
                  log.status === "FAILED"
                    ? "text-destructive/90 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {log.message}
              </span>
            </div>
          </div>
        ))}
        {/* End of logs visual spacer */}
        <div className="h-12" />
      </div>
    </div>
  );
}
