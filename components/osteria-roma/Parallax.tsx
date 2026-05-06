"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import { cn } from "@/lib/utils";

interface ParallaxItemProps extends HTMLMotionProps<"div"> {
  start: number;
  end: number;
}

export function ParallaxItem({
  start,
  end,
  className,
  style,
  ...props
}: ParallaxItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div
      className={className}
      ref={ref}
      style={{ transform, opacity, ...style }}
      {...props}
    />
  );
}

interface ParallaxSectionProps {
  imageUrl: string;
  children?: React.ReactNode;
  className?: string;
}

export function ParallaxSection({
  imageUrl,
  children,
  className,
}: ParallaxSectionProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ minHeight: "280px" }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ y, scale: 1.2 }}
      >
        <img
          src={imageUrl}
          alt="Osteria Roma parallax"
          className="w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120D08] via-transparent to-[#120D08]" />
      </motion.div>
      <div className="relative z-10 flex items-center justify-center h-full min-h-[280px]">
        {children}
      </div>
    </div>
  );
}
