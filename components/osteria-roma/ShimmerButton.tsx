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
        padding: "14px 48px",
        background: "transparent",
        border: "1px solid rgba(196, 98, 45, 0.55)",
        cursor: "pointer",
      }}
      {...props}
    >
      {/* Shimmer sweep — always-on */}
      <motion.span
        className="absolute inset-0 -skew-x-12"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(196,98,45,0.28), transparent)",
        }}
        animate={{ x: ["-200%", "200%"] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0.8,
        }}
      />

      <span
        className="relative z-10"
        style={{
          fontFamily: "'Work Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#F0E6D3",
        }}
      >
        {children}
      </span>
    </button>
  );
}
