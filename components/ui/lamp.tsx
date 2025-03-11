"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { ReactNode } from "react";

interface LampContainerProps {
  children: ReactNode;
  className?: string;
}

export const LampContainer = ({ children, className }: LampContainerProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden w-full rounded-md z-0 ",
        className
      )}
    >
      <div className="relative flex w-full flex-1 isolate items-center justify-center  ">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute right-1/2 h-64 w-[30rem] bg-gradient-to-l from-[hsl(var(--muted))] to-transparent "
        />
        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute left-1/2 h-64 w-[30rem] bg-gradient-to-r from-[hsl(var(--muted))] to-transparent"
        />
        {/* Blur for the bottom */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[hsl(var(--card))] blur-2xl " />
        {/* Light coming out from source */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "28rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute z-50 h-36 rounded-full bg-[hsl(var(--primary))] opacity-50 blur-3xl top-1/2 -translate-y-40 "
        />
        {/* Light source */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute z-50 h-1.5 w-[30rem] top-[2rem] bg-[hsl(var(--primary))]"
        />
        {/* Shade for the top */}
        <div className="absolute z-40 h-[2rem] w-full top-0 bg-[hsl(var(--background))]" />
      </div>

      <div className="relative z-50 flex  flex-col items-center px-5 h-full  -translate-y-80">
        {children}
      </div>
    </div>
  );
};
