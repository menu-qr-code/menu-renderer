'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BUOZZI_GRADIENTS = [
  "linear-gradient(135deg, #1C0F0A 0%, #2E1208 100%)",
  "linear-gradient(135deg, #2E1208 0%, #3A1610 100%)",
  "linear-gradient(135deg, #3A1610 0%, #1C0F0A 100%)",
  "linear-gradient(135deg, #1C0F0A 0%, #2E1208 100%)",
];

type GradientBackgroundProps = React.ComponentProps<'div'> & {
  gradients?: string[];
  animationDuration?: number;
};

export function GradientBackground({
  children,
  className = '',
  gradients = BUOZZI_GRADIENTS,
  animationDuration = 12,
}: GradientBackgroundProps) {
  return (
    <div className={cn('w-full relative min-h-screen overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0"
        style={{ background: gradients[0] }}
        animate={{ background: gradients }}
        transition={{
          duration: animationDuration,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
