import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Define color variations
type TerminalColor = "zinc" | "blue" | "green" | "red" | "purple";

interface TerminalProps {
  lines: string[];
  welcomeMessage?: string;
  prompt?: string;
  height?: number | string;
  color?: TerminalColor;
}

const Terminal = ({
  lines = [],
  welcomeMessage = "Welcome to Terminal",
  prompt = ">",
  height = 400,
  color = "zinc",
}: TerminalProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastLineRef = useRef<HTMLDivElement>(null);

  // Theme and color configuration
  const themeStyles = {
    default: {
      zinc: {
        text: "text-zinc-100",
        prompt: "text-zinc-500",
        welcomeMessage: "text-zinc-400",
        scrollButton: "bg-zinc-800/80 hover:bg-zinc-700/80",
      },
      blue: {
        text: "text-blue-100",
        prompt: "text-blue-500",
        welcomeMessage: "text-blue-400",
        scrollButton: "bg-blue-800/80 hover:bg-blue-700/80",
      },
      green: {
        text: "text-green-100",
        prompt: "text-green-500",
        welcomeMessage: "text-green-400",
        scrollButton: "bg-green-800/80 hover:bg-green-700/80",
      },
      red: {
        text: "text-red-100",
        prompt: "text-red-500",
        welcomeMessage: "text-red-400",
        scrollButton: "bg-red-800/80 hover:bg-red-700/80",
      },
      purple: {
        text: "text-purple-100",
        prompt: "text-purple-500",
        welcomeMessage: "text-purple-400",
        scrollButton: "bg-purple-800/80 hover:bg-purple-700/80",
      },
    },
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current && lastLineRef.current) {
      scrollAreaRef.current.scrollTop =
        scrollAreaRef.current.scrollHeight - scrollAreaRef.current.clientHeight;
    }
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
    if (!showScrollButton) {
      scrollToBottom();
    }
  }, [lines, showScrollButton]);

  // Get current theme styles
  const currentStyles = themeStyles["default"][color];

  return (
    <Card className={`relative `}>
      <CardContent className="p-0 relative">
        <div
          ref={scrollAreaRef}
          className="h-full overflow-auto"
          style={{ height }}
        >
          <div
            ref={contentRef}
            className={`p-4 font-mono text-sm ${currentStyles.text}`}
          >
            {welcomeMessage && (
              <div className={`mb-4 ${currentStyles.welcomeMessage}`}>
                {welcomeMessage}
              </div>
            )}

            {lines.map((line, index) => (
              <div
                key={index}
                ref={index === lines.length - 1 ? lastLineRef : null}
                className="min-h-[20px]"
              >
                <span className={`select-none ${currentStyles.prompt}`}>
                  {prompt}{" "}
                </span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className={`      
            absolute bottom-4 right-4 
            ${currentStyles.scrollButton} 
            transition-all 
            duration-300 
            ease-in-out 
            scale-0 
            ${
              showScrollButton ? "scale-100 opacity-100" : "scale-0 opacity-0"
            } `}
          onClick={scrollToBottom}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Terminal;
