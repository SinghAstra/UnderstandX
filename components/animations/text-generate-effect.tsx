"use client";
import { cn } from "@/lib/utils";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function TextGenerateEffect({
  words,
  className,
}: {
  words: string;
  className?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    words.slice(0, latest)
  );

  useEffect(() => {
    const controls = animate(count, words.length, {
      type: "tween",
      duration: 1,
      ease: "easeIn",
    });
    return controls.stop;
  }, [words]);

  return (
    <motion.span className={cn("", className)}>
      {displayText}
    </motion.span>
  );
}