"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface Piatto {
  nome: string;
  desc: string;
  prezzo: string;
  tag?: string;
  img: string;
}

interface PiattoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  piatto: Piatto | null;
}

export function PiattoDrawer({ isOpen, onClose, piatto }: PiattoDrawerProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted || !piatto) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.9 }}
            style={{
              background: "#261510",
              borderRadius: "12px 12px 0 0",
              overflow: "hidden",
              width: "100%",
              maxWidth: 540,
              maxHeight: "88vh",
              overflowY: "auto",
              border: "1px solid #3D2218",
              borderBottom: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "#3D2218" }} />
            </div>

            {/* Image */}
            <div style={{ position: "relative" }}>
              <img
                src={piatto.img}
                alt={piatto.nome}
                style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, #261510 0%, transparent 50%)",
                }}
              />
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "rgba(28,15,10,0.7)",
                  border: "none",
                  cursor: "pointer",
                  color: "#F2E8D9",
                  padding: 8,
                  borderRadius: 4,
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
              {piatto.tag && (
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: "#C4502A",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {piatto.tag}
                </span>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: "20px 24px 32px" }}>
              <h3
                style={{
                  color: "#F2E8D9",
                  fontSize: 22,
                  fontWeight: 700,
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontFamily: "Georgia, serif",
                }}
              >
                {piatto.nome}
              </h3>
              <p style={{ color: "#9C8472", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px" }}>
                {piatto.desc}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#C4502A", fontSize: 24, fontWeight: 700, fontFamily: "Georgia, serif" }}>
                  {piatto.prezzo}
                </span>
                <button
                  onClick={onClose}
                  style={{
                    background: "transparent",
                    border: "1px solid #3D2218",
                    color: "#9C8472",
                    padding: "8px 20px",
                    borderRadius: 2,
                    cursor: "pointer",
                    fontSize: 13,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
