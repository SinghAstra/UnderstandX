"use client";
import { Log, RepoStatus } from "@understand-x/database";
import { useEffect, useRef } from "react";

export function TerminalView({ logs }: { logs: Log[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-950 text-slate-50 h-full font-mono text-sm p-6 overflow-hidden flex flex-col">
      <div className="flex gap-2 mb-4 border-b border-slate-800 pb-2">
        <div className="w-3 h-3 rounded-full bg-rose-500" />
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="ml-2 text-slate-500">
          understandx-worker --verbose
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 scrollbar-hide"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-slate-500 shrink-0">
              [{new Date(log.createdAt).toLocaleTimeString()}]
            </span>
            <span
              className={
                log.status === RepoStatus.FAILED
                  ? "text-rose-400"
                  : "text-slate-300"
              }
            >
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-600 italic underline decoration-dotted">
            Waiting for worker heartbeat...
          </div>
        )}
      </div>
    </div>
  );
}
