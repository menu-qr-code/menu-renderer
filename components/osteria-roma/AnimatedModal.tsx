"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PiattoData } from "./data";

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
            style={{ background: "rgba(18, 13, 8, 0.88)", backdropFilter: "blur(8px)" }}
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
                background: "#1E1610",
                border: "1px solid rgba(196, 98, 45, 0.2)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1610] via-transparent to-transparent" />
              </div>

              {/* Contenuto */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h2
                    style={{
                      fontFamily: "'EB Garamond', 'Georgia', serif",
                      fontSize: "30px",
                      fontWeight: 500,
                      fontStyle: "italic",
                      color: "#F0E6D3",
                      lineHeight: 1.1,
                      flex: 1,
                      marginRight: "12px",
                    }}
                  >
                    {piatto.nome}
                  </h2>
                  <span
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#C4622D",
                      flexShrink: 0,
                    }}
                  >
                    {piatto.prezzo}
                  </span>
                </div>

                {piatto.descrizione && (
                  <p
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "#9E7D62",
                      lineHeight: 1.7,
                      marginBottom: "12px",
                    }}
                  >
                    {piatto.descrizione}
                  </p>
                )}

                {piatto.ingredienti && (
                  <p
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#E8A87C",
                      letterSpacing: "0.05em",
                      marginBottom: "8px",
                    }}
                  >
                    {piatto.ingredienti}
                  </p>
                )}

                {piatto.allergeni && (
                  <p
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 300,
                      color: "#9E7D62",
                      opacity: 0.7,
                    }}
                  >
                    Allergeni: {piatto.allergeni}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full p-2 z-10"
                style={{
                  background: "rgba(18, 13, 8, 0.75)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(240, 230, 211, 0.15)",
                  cursor: "pointer",
                  color: "#F0E6D3",
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
