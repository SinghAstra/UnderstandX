"use client";
import { useEffect, useRef, useState } from "react";

export function TerminalView({ logs }: { logs: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll logic
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs, autoScroll]);

  // Detect if user scrolls up manually to disable auto-scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 shadow-2xl overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          {autoScroll ? "● Live Follow" : "Paused"}
        </div>
      </div>

      {/* Log Content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-slate-800"
      >
        {logs.map((log, i) => (
          <div
            key={log.id || i}
            className="group flex gap-3 hover:bg-slate-900/50 rounded px-1"
          >
            <span className="text-slate-600 shrink-0 tabular-nums">
              {new Date(log.createdAt).toLocaleTimeString([], {
                hour12: false,
              })}
            </span>
            <span
              className={`break-all ${
                log.level === "ERROR"
                  ? "text-rose-400"
                  : log.level === "WARN"
                  ? "text-amber-300"
                  : "text-slate-300"
              }`}
            >
              <span className="text-slate-500 mr-2">$</span>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
