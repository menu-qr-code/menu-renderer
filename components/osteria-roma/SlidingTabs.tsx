"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TabItem {
  key: string;
  label: string;
  panel?: React.ReactNode;
}

interface SlidingTabsProps {
  items: TabItem[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export default function SlidingTabs({
  items,
  defaultIndex = 0,
  onChange,
  className,
}: SlidingTabsProps) {
  const [active, setActive] = React.useState(defaultIndex);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const activeBtn = tabRefs.current[active];
    if (!container || !activeBtn) return setIndicator(null);
    const cRect = container.getBoundingClientRect();
    const tRect = activeBtn.getBoundingClientRect();
    setIndicator({ left: tRect.left - cRect.left, width: tRect.width });
  }, [active]);

  React.useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    tabRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  React.useEffect(() => {
    onChange?.(active);
  }, [active, onChange]);

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={containerRef}
        role="tablist"
        className="relative inline-flex items-center gap-1 p-1 rounded-2xl overflow-x-auto"
        style={{
          background: "rgba(30, 22, 16, 0.85)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(240, 230, 211, 0.1)",
          maxWidth: "100%",
        }}
      >
        {indicator && (
          <motion.div
            className="absolute pointer-events-none rounded-xl"
            style={{
              top: 6,
              height: "calc(100% - 12px)",
              background: "linear-gradient(90deg, #C4622D, #E8A87C)",
              opacity: 0.85,
            }}
            animate={{ left: indicator.left, width: indicator.width }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <button
              key={item.key}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: isActive ? "#F0E6D3" : "#9E7D62",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "10px",
                position: "relative",
                zIndex: 10,
                transition: "color 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {items.map((item, i) => (
          <div
            key={item.key}
            role="tabpanel"
            hidden={i !== active}
          >
            {item.panel ?? null}
          </div>
        ))}
      </div>
    </div>
  );
}
