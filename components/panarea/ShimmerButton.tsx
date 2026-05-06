"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function ShimmerButton({ children, className, onClick, ...props }: ShimmerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        className
      )}
      style={{
        padding: "14px 40px",
        background: "transparent",
        border: "1px solid rgba(232, 98, 42, 0.5)",
        cursor: "pointer",
      }}
      {...props}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="absolute inset-0 -skew-x-12"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(232,98,42,0.25), transparent)",
        }}
        animate={{ x: ["-200%", "200%"] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 1.2,
        }}
      />

      {/* Subtle fill on hover via opacity trick */}
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: "rgba(232, 98, 42, 0.1)",
        }}
      />

      <span
        className="relative z-10"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#F8F6F0",
        }}
      >
        {children}
      </span>
    </button>
  );
}
