import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LogEntry = {
  id: string;
  timestamp: Date;
  message: string;
  status?: string;
};

interface TerminalProps {
  logs: LogEntry[];
  height?: string;
}

function Terminal({ logs, height = "400px" }: TerminalProps) {
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
    <div className="w-full bg-background">
      <div className="relative">
        <div className="bg-card rounded-lg border border-border">
          <div
            className="rounded-md p-4 overflow-y-auto font-mono text-sm space-y-2 relative"
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ height }}
          >
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-1"
              >
                <span className="text-muted-foreground">
                  {log.timestamp?.toLocaleTimeString()}
                </span>
                <span className="text-foreground whitespace-pre-wrap">
                  {log.message}
                </span>
                {log.status && (
                  <span className={`text-${log.status.toLowerCase()}`}>
                    [{log.status}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {!autoScroll && (
            <motion.button
              onClick={scrollToBottom}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 right-4 bg-muted text-muted-foreground p-3 rounded-full shadow-md hover:cursor-pointer"
            >
              <ArrowDown size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Terminal;
