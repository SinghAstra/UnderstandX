import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "left" | "right";
}

export function SlideIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "left",
}: SlideInProps) {
  const initial = direction === "left" ? -100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: initial }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
