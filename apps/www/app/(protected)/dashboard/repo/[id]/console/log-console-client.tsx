"use client";

import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogResponse, SOCKET_EVENTS } from "@understand-x/shared";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

interface Props {
  repoId: string;
  initialData: LogResponse[];
  apiUrl: string;
}

export function LogConsoleClient({ repoId, initialData, apiUrl }: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["logs", repoId];
  const logsEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { data: logs } = useQuery<LogResponse[]>({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/repos/${repoId}/logs`);
      const result = await res.json();
      return result.data;
    },
    initialData,
  });

  // Intersection Observer to toggle "Scroll to Bottom" button
  // Re-run when logs update to ensure we observe the new end
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    if (logsEndRef.current) {
      observer.observe(logsEndRef.current);
    }

    return () => observer.disconnect();
  }, [logs]);

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

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={scrollContainerRef}
      className="h-full w-full rounded-lg border border-border/40 bg-muted/30 shadow-2xl overflow-y-hidden relative scrollbar-hide"
    >
      <div className="p-4 font-mono text-sm leading-relaxed space-y-0.5 h-full overflow-y-auto">
        {logs.map((log, i) => (
          <div
            key={log.id}
            className={cn(
              "flex gap-3 px-2 py-1 rounded transition-all duration-300 group hover:bg-muted/50",
              // Tailwind-only entry animation for new logs
              i === logs.length - 1 &&
                "animate-in fade-in slide-in-from-left-1 duration-500"
            )}
          >
            {/* Timestamp */}
            <span className="text-muted-foreground/30 tabular-nums shrink-0 select-none group-hover:text-muted-foreground/50 transition-colors">
              {new Date(log.createdAt).toLocaleTimeString([], {
                hour12: false,
              })}
            </span>

            {/* Status Bar */}
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
                  "break-all",
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

        <div ref={logsEndRef} className="h-4" />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={cn(
            "absolute cursor-pointer bottom-6 right-6 z-50",
            "bg-accent text-muted-foreground rounded-full p-2.5 shadow-xl border border-border/40",
            "active:scale-95 transition-all duration-300",
            "animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300"
          )}
          aria-label="Scroll to bottom"
        >
          <ChevronDown className="size-7 duration-600" />
        </button>
      )}
    </div>
  );
}
