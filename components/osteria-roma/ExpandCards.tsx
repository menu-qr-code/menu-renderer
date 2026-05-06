"use client";

import React from "react";
import { motion } from "motion/react";
import type { PiattoData } from "./data";

interface ExpandCardsProps {
  piatti: PiattoData[];
  onSelect: (p: PiattoData) => void;
}

function DishCard({ piatto, onSelect }: { piatto: PiattoData; onSelect: (p: PiattoData) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        background: "#1E1610",
        border: "1px solid #2E2018",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(piatto)}
    >
      {/* Foto 4:3 — no testo sopra */}
      <div style={{ position: "relative", paddingTop: "75%" }}>
        <img
          src={piatto.imageUrl}
          alt={piatto.nome}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="lazy"
        />
      </div>

      {/* Area testo sotto */}
      <div style={{ padding: "12px 16px" }}>
        <h3
          style={{
            fontFamily: "'EB Garamond', 'Georgia', serif",
            fontSize: "18px",
            fontWeight: 500,
            color: "#F0E6D3",
            marginBottom: "4px",
            lineHeight: 1.25,
          }}
        >
          {piatto.nome}
        </h3>

        {piatto.descrizione && (
          <p
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "#9E7D62",
              lineHeight: 1.5,
              marginBottom: "12px",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {piatto.descrizione}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#C4622D",
            }}
          >
            {piatto.prezzo}
          </span>

          <button
            aria-label={`Aggiungi ${piatto.nome}`}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#C4622D",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F0E6D3",
              fontSize: "18px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function ExpandCards({ piatti, onSelect }: ExpandCardsProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "12px",
        marginTop: "24px",
      }}
    >
      {piatti.map((piatto) => (
        <DishCard key={piatto.id} piatto={piatto} onSelect={onSelect} />
      ))}
    </div>
  );
}
