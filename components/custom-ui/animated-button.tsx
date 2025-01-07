import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils/utils';
import { HTMLMotionProps, motion } from 'framer-motion';
import React from 'react';

// Create a type that combines Button props with Motion props
type MotionButtonProps = Omit<HTMLMotionProps<"button">, keyof ButtonProps> & ButtonProps;

interface AnimatedButtonProps extends MotionButtonProps {
  animateOnHover?: boolean;
  animateOnTap?: boolean;
}

// Create a proper component type for the motion button
const MotionButton = motion(Button) as React.ComponentType<MotionButtonProps>;

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    className, 
    animateOnHover = true, 
    animateOnTap = true,
    ...props 
  }, ref) => {
    const buttonVariants = {
      initial: {
        scale: 1
      },
      hover: animateOnHover ? {
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      } : {},
      tap: animateOnTap ? {
        scale: 0.98,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      } : {}
    };

    return (
      <MotionButton
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        {...props}
      >
        {children}
      </MotionButton>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton };
