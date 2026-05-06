import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps, Variant } from "motion/react";
import React, { forwardRef } from "react";

type Direction = "up" | "down" | "left" | "right";

const generateVariants = (
  direction: Direction
): { hidden: Record<string, unknown>; visible: Record<string, unknown> } => {
  const isX = direction === "left" || direction === "right";
  const value = direction === "right" || direction === "down" ? 100 : -100;

  if (isX) {
    return {
      hidden: { filter: "blur(10px)", opacity: 0, x: value },
      visible: { filter: "blur(0px)", opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };
  }
  return {
    hidden: { filter: "blur(10px)", opacity: 0, y: value },
    visible: { filter: "blur(0px)", opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
};

const defaultViewport = { amount: 0.3, margin: "0px 0px -200px 0px" };

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  viewport?: {
    amount?: number;
    margin?: string;
    once?: boolean;
  };
  delay?: number;
  direction?: Direction;
}

const ScrollAnimation = forwardRef<HTMLDivElement, ScrollAnimationProps>(
  (
    {
      children,
      className,
      viewport = defaultViewport,
      delay = 0,
      direction = "up",
    },
    ref
  ) => {
    const base = generateVariants(direction);
    const modifiedVariants = {
      hidden: base.hidden,
      visible: {
        ...(base.visible as object),
        transition: {
          ...((base.visible as any).transition),
          delay,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        whileInView="visible"
        initial="hidden"
        variants={modifiedVariants as any}
        viewport={viewport}
        className={cn(className)}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollAnimation.displayName = "ScrollAnimation";

export default ScrollAnimation;
