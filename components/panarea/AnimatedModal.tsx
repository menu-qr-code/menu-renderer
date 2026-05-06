"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PiattoData } from "./LiquidGlassCard";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  piatto: PiattoData | null;
}

export function AnimatedModal({ isOpen, onClose, piatto }: AnimatedModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!piatto) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(13, 27, 42, 0.85)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-0 sm:pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="relative w-full rounded-t-3xl sm:rounded-3xl overflow-hidden"
              style={{
                maxWidth: "480px",
                background: "#0B2D4E",
                border: "1px solid rgba(74, 144, 184, 0.2)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              }}
              initial={{ scale: 0.96, y: 32, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 16, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
            >
              {/* Immagine */}
              <div className="relative w-full" style={{ height: "240px" }}>
                <img
                  src={piatto.imageUrl}
                  alt={piatto.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D4E] via-transparent to-transparent" />
              </div>

              {/* Contenuto */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2
                    style={{
                      fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                      fontSize: "32px",
                      fontWeight: 400,
                      fontStyle: "italic",
                      color: "#F8F6F0",
                      lineHeight: 1.1,
                    }}
                  >
                    {piatto.nome}
                  </h2>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "20px",
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
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "#A8A099",
                    lineHeight: 1.7,
                    marginBottom: "12px",
                  }}
                >
                  {piatto.descrizione}
                </p>

                {piatto.ingredienti && (
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      fontWeight: 300,
                      color: "#4A90B8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {piatto.ingredienti}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full p-2 z-10"
                style={{
                  background: "rgba(13, 27, 42, 0.7)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(248, 246, 240, 0.15)",
                  cursor: "pointer",
                  color: "#F8F6F0",
                }}
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
