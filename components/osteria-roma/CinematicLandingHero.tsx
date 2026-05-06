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
  title = "Osteria Roma",
  subtitle = "Trastevere · Roma",
  tagline = "La cucina della tradizione",
  imageUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&auto=format&fit=crop&q=80",
  ctaText = "Sfoglia il Menu",
  onCtaClick,
}: CinematicLandingHeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <img
          src={imageUrl}
          alt="Osteria Roma hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#120D08]/60 via-[#120D08]/40 to-[#120D08]/90" />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.p
          style={{
            fontFamily: "'Work Sans', sans-serif",
            color: "#C4622D",
            fontSize: "11px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: "24px",
            fontWeight: 400,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {subtitle}
        </motion.p>

        <div className="overflow-hidden mb-4">
          <BlurReveal delay={0.5} duration={1.4}>
            <h1
              style={{
                fontFamily: "'EB Garamond', 'Georgia', serif",
                fontSize: "clamp(56px, 10vw, 96px)",
                fontWeight: 500,
                fontStyle: "italic",
                color: "#F0E6D3",
                lineHeight: 1.05,
              }}
            >
              {title}
            </h1>
          </BlurReveal>
        </div>

        <BlurReveal delay={1} duration={1}>
          <p
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 300,
              letterSpacing: "0.12em",
              color: "#9E7D62",
              marginTop: "16px",
              marginBottom: "40px",
            }}
          >
            {tagline}
          </p>
        </BlurReveal>

        <motion.button
          onClick={onCtaClick}
          style={{
            fontFamily: "'Work Sans', sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#F0E6D3",
            background: "transparent",
            border: "1px solid rgba(240, 230, 211, 0.35)",
            borderRadius: "9999px",
            padding: "14px 40px",
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

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-[#F0E6D3]/30 to-transparent mx-auto" />
      </motion.div>
    </section>
  );
}
