"use client";

import React from "react";
import { motion } from "motion/react";

export interface PiattoData {
  id: number;
  nome: string;
  prezzo: string;
  descrizione: string;
  ingredienti?: string;
  imageUrl: string;
  categoria: string;
}

interface LiquidGlassCardProps {
  piatto: PiattoData;
  onClick?: (piatto: PiattoData) => void;
}

export function LiquidGlassCard({ piatto, onClick }: LiquidGlassCardProps) {
  return (
    <>
      <GlassFilter />
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          backdropFilter: 'blur(12px) url("#panarea-glass")',
          background: "rgba(74, 144, 184, 0.06)",
          border: "1px solid rgba(248, 246, 240, 0.1)",
          boxShadow:
            "0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 1px 1px 1px -0.5px rgba(255,255,255,0.12), inset -1px -1px 1px -0.5px rgba(255,255,255,0.06), 0 0 12px rgba(74,144,184,0.08)",
        }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onClick?.(piatto)}
      >
        {/* Immagine piatto */}
        <div className="relative w-full overflow-hidden" style={{ height: "200px" }}>
          <img
            src={piatto.imageUrl}
            alt={piatto.nome}
            className="w-full h-full object-cover"
            style={{ transition: "transform 0.6s ease" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-transparent" />
        </div>

        {/* Contenuto */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "22px",
                fontWeight: 400,
                color: "#F8F6F0",
                lineHeight: 1.2,
              }}
            >
              {piatto.nome}
            </h3>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 300,
                color: "#E8622A",
              }}
            >
              {piatto.prezzo}
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "#A8A099",
              lineHeight: 1.6,
            }}
          >
            {piatto.descrizione}
          </p>
        </div>
      </motion.div>
    </>
  );
}

function GlassFilter() {
  return (
    <svg className="absolute" style={{ width: 0, height: 0 }}>
      <defs>
        <filter
          id="panarea-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.02"
            numOctaves="1"
            seed="3"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="80"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="3" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
