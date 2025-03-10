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
      <div className="relative flex w-full flex-1 scale-y-125 isolate items-center justify-center z-0 ">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute right-1/2 h-64 w-[30rem] bg-gradient-to-l from-[hsl(var(--muted))] to-transparent"
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
        {/* Light blur for the top */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "28rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute z-50 h-36 -translate-y-12 rounded-full bg-[hsl(var(--primary))] opacity-50 blur-3xl "
        />
        {/* Light source */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute z-50 h-1.5 w-[30rem] -translate-y-[7rem] bg-[hsl(var(--primary))]"
        />
        {/* Shade for the top */}
        <div className="absolute z-40 h-44 w-full -translate-y-[12.5rem] bg-[hsl(var(--background))]" />
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5 ">
        {children}
      </div>
    </div>
  );
};
