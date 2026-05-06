"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  imageUrl: string;
  name: string;
  prezzo: string;
  desc: string;
  tag?: string;
  onCardClick?: () => void;
  className?: string;
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MenuItemCard = React.forwardRef<HTMLDivElement, MenuItemCardProps>(
  ({ className, imageUrl, name, prezzo, desc, tag, onCardClick }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative flex flex-col w-full overflow-hidden cursor-pointer group",
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        onClick={onCardClick}
        style={{
          background: "#261510",
          border: "1px solid #3D2218",
          borderRadius: 4,
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ height: 220 }}>
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(38,21,16,0.9) 0%, transparent 55%)",
            }}
          />
          {tag && (
            <span
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                background: "#C4502A",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "16px 20px 20px" }}>
          <h3
            style={{
              color: "#F2E8D9",
              fontSize: 17,
              fontWeight: 700,
              margin: "0 0 6px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontFamily: "Georgia, serif",
            }}
          >
            {name}
          </h3>
          <p
            style={{
              color: "#9C8472",
              fontSize: 13,
              lineHeight: 1.5,
              margin: "0 0 12px",
            }}
          >
            {desc.length > 80 ? desc.substring(0, 80) + "…" : desc}
          </p>
          <span
            style={{
              color: "#C4502A",
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
            }}
          >
            {prezzo}
          </span>
        </div>
      </motion.div>
    );
  }
);

MenuItemCard.displayName = "MenuItemCard";

export { MenuItemCard };
