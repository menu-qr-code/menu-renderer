"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromoModal({ isOpen, onClose }: PromoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

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

  if (!mounted) return null;

  const handleSubmit = () => {
    if (!phone.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPhone("");
      onClose();
    }, 2000);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.75)",
            padding: "0 16px",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 32, mass: 0.7 }}
            style={{
              background: "#1C0F0A",
              border: "1px solid #3D2218",
              borderRadius: 6,
              maxWidth: 420,
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warm accent bar */}
            <div style={{ height: 4, background: "linear-gradient(to right, #C4502A, #8C3018)" }} />

            <div style={{ padding: "24px 24px 28px" }}>
              <button
                onClick={onClose}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9C8472",
                  padding: 4,
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>

              <p
                style={{
                  color: "#C4502A",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Solo per stasera
              </p>

              <h2
                style={{
                  color: "#F2E8D9",
                  fontSize: 24,
                  fontWeight: 700,
                  margin: "0 0 8px",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1.2,
                }}
              >
                10% al prossimo ritorno
              </h2>

              <p style={{ color: "#9C8472", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
                Lascia il tuo numero. Ti avvisiamo dei menù speciali,
                delle serate di musica e delle novità stagionali.
              </p>

              {submitted ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "16px 0",
                    color: "#C4502A",
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Benvenuto nella famiglia Buozzi! 🍷
                </div>
              ) : (
                <>
                  <input
                    type="tel"
                    placeholder="+39 333 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#261510",
                      border: "1px solid #3D2218",
                      color: "#F2E8D9",
                      fontSize: 15,
                      borderRadius: 2,
                      marginBottom: 12,
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    style={{
                      width: "100%",
                      padding: 14,
                      background: "#C4502A",
                      border: "none",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      borderRadius: 2,
                      fontFamily: "Georgia, serif",
                      marginBottom: 10,
                    }}
                  >
                    Attiva lo sconto
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      display: "block",
                      margin: "0 auto",
                      background: "transparent",
                      border: "none",
                      color: "#9C8472",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    No grazie
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
