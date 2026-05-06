"use client";

import React from "react";
import { motion } from "motion/react";
import { BlurReveal } from "./BlurReveal";

interface CinematicLandingHeroProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  imageUrl?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function CinematicLandingHero({
  title = "Pizzeria Panarea",
  subtitle = "Napoli · Chiaia",
  tagline = "L'isola nel piatto",
  imageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80",
  ctaText = "Scopri il Menu",
  onCtaClick,
}: CinematicLandingHeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background image with Ken Burns */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <img
          src={imageUrl}
          alt="Panarea hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/60 via-[#0D1B2A]/40 to-[#0D1B2A]/90" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          className="text-[#4A90B8] text-xs tracking-[0.4em] uppercase mb-6 font-light"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>

        <div className="overflow-hidden mb-4">
          <BlurReveal delay={0.5} duration={1.4}>
            <h1
              className="text-[#F8F6F0]"
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(56px, 10vw, 96px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.05,
              }}
            >
              {title}
            </h1>
          </BlurReveal>
        </div>

        <BlurReveal delay={1} duration={1}>
          <p
            className="text-[#A8A099] mt-4 mb-10"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              fontWeight: 300,
              letterSpacing: "0.1em",
            }}
          >
            {tagline}
          </p>
        </BlurReveal>

        <motion.button
          onClick={onCtaClick}
          className="border border-[#F8F6F0]/30 text-[#F8F6F0] px-10 py-3 rounded-full"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            background: "transparent",
            cursor: "pointer",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          whileTap={{ scale: 0.97 }}
        >
          {ctaText}
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-[#F8F6F0]/40 to-transparent" />
      </motion.div>
    </section>
  );
}
