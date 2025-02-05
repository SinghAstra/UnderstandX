import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface TerminalProps {
  lines: string[];
  welcomeMessage?: string;
  prompt?: string;
  height?: number | string;
  scrollButtonClassName?: string;
}

const Terminal = ({
  lines = [],
  welcomeMessage = "Welcome to Terminal",
  prompt = ">",
  height = 400,
  scrollButtonClassName = "",
}: TerminalProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastLineRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    lastLineRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const checkScrollPosition = () => {
      if (scrollAreaRef.current && contentRef.current) {
        const scrollArea = scrollAreaRef.current;

        const isAtBottom =
          scrollArea.scrollHeight -
            scrollArea.scrollTop -
            scrollArea.clientHeight <
          10;

        setShowScrollButton(!isAtBottom);
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("scroll", checkScrollPosition);
      return () => {
        scrollArea.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  return (
    <Card className="relative bg-zinc-900 border-zinc-800">
      <CardContent className="p-0 relative">
        <div
          ref={scrollAreaRef}
          className="h-full overflow-auto"
          style={{ height }}
        >
          <div ref={contentRef} className="p-4 font-mono text-sm text-zinc-100">
            {welcomeMessage && (
              <div className="mb-4 text-zinc-400">{welcomeMessage}</div>
            )}

            {lines.map((line, index) => (
              <div
                key={index}
                ref={index === lines.length - 1 ? lastLineRef : null}
                className="min-h-[20px]"
              >
                <span className="select-none text-zinc-500">{prompt} </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {showScrollButton && (
          <Button
            size="icon"
            variant="secondary"
            className={`absolute bottom-4 right-4 bg-zinc-800/80 hover:bg-zinc-700/80 transition-all ${scrollButtonClassName}`}
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Terminal;
