"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimationContainerProps {
  children: React.ReactNode;
  delay?: number;
  reverse?: boolean;
  className?: string;
}

export const VerticalAnimationContainer = ({
  children,
  className,
  reverse,
  delay,
}: AnimationContainerProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reverse ? -100 : 100 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, y: reverse ? 100 : -100 }}
      transition={{
        duration: 0.2,
        delay: delay,
        ease: "easeInOut",
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

export const HorizontalAnimationContainer = ({
  children,
  className,
  reverse,
  delay,
}: AnimationContainerProps) => {
  return (
    <motion.div
      className={className}
      initial={{ x: reverse ? -100 : 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0, x: reverse ? 100 : -100 }}
      transition={{
        duration: 0.2,
        delay: delay,
        ease: "easeInOut",
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};
