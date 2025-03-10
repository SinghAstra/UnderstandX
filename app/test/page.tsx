"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { ReactNode } from "react";

interface LampContainerProps {
  children: ReactNode;
  className?: string;
}

const TestPage = () => {
  return <LampContainer>TestPage</LampContainer>;
};

const LampContainer = ({ children, className }: LampContainerProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden w-full rounded-md z-0 border border-pink-400",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 isolate  items-center justify-center z-0 border border-yellow-400">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute right-1/2 h-56 w-[30rem] bg-gradient-to-r from-cyan-500 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute left-1/2 h-56 w-[30rem] bg-gradient-to-l from-cyan-500 to-transparent"
        />
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5 border border-green-400">
        {children}
      </div>
    </div>
  );
};

export default TestPage;
