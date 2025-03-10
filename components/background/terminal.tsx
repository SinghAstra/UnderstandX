"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type LogEntry = {
  id: string;
  timestamp: Date;
  message: string;
  status?: string;
};

interface TerminalProps {
  logs: LogEntry[];
  height?: string;
  className?: string;
}

const Terminal = ({
  logs,
  height = "300px",
  className = "",
}: TerminalProps) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && autoScroll) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const current = scrollRef.current;
      const isAtBottom =
        current.scrollHeight - current.scrollTop <= current.clientHeight + 100;
      setAutoScroll(isAtBottom);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
      setAutoScroll(true);
    }
  };

  return (
    <div
      className={`w-full bg-background/40 backdrop-blur rounded-lg border ${className}`}
    >
      <div className="relative">
        <div
          className="rounded-md p-4 overflow-y-auto font-mono text-xs space-y-2 relative text-muted-foreground"
          ref={scrollRef}
          onScroll={handleScroll}
          style={{ height }}
        >
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-1"
            >
              <span className="text-muted-foreground opacity-70">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="whitespace-pre-wrap">{log.message}</span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {!autoScroll && (
            <motion.button
              onClick={scrollToBottom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4 bg-muted text-muted-foreground p-2 rounded-full shadow-md hover:cursor-pointer"
            >
              <ArrowDown size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Terminal;
