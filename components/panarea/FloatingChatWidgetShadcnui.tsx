"use client";

import * as React from "react";
import { motion, MotionConfig, AnimatePresence, type Transition } from "motion/react";
import { X, MessageSquare, Send } from "lucide-react";

interface FloatingChatWidgetProps {
  offerTitle?: string;
  offerDescription?: string;
  triggerDelay?: number;
}

const transition: Transition = { type: "spring", bounce: 0, duration: 0.35 };

export function FloatingChatWidgetShadcnui({
  offerTitle = "Torna a Panarea",
  offerDescription = "Lascia il tuo numero per ricevere il 10% di sconto sulla prossima visita.",
  triggerDelay = 30000,
}: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), triggerDelay);
    return () => clearTimeout(timer);
  }, [triggerDelay]);

  const handleSubmit = () => {
    if (phone.trim().length >= 8) {
      setSubmitted(true);
    }
  };

  if (!visible) return null;

  return (
    <MotionConfig transition={transition}>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="open"
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                width: "320px",
                background: "#0B2D4E",
                border: "1px solid rgba(74, 144, 184, 0.25)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid rgba(74, 144, 184, 0.15)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(232, 98, 42, 0.2)", color: "#E8622A" }}
                  >
                    <span style={{ fontSize: "14px" }}>🌊</span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#F8F6F0",
                    }}
                  >
                    Offerta esclusiva
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A099" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                {!submitted ? (
                  <>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                        fontSize: "24px",
                        fontWeight: 400,
                        fontStyle: "italic",
                        color: "#F8F6F0",
                        marginBottom: "8px",
                      }}
                    >
                      {offerTitle}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "13px",
                        fontWeight: 300,
                        color: "#A8A099",
                        lineHeight: 1.6,
                        marginBottom: "16px",
                      }}
                    >
                      {offerDescription}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        placeholder="Il tuo numero..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="flex-1 rounded-xl px-4 py-2.5 outline-none text-sm"
                        style={{
                          background: "rgba(74, 144, 184, 0.1)",
                          border: "1px solid rgba(74, 144, 184, 0.2)",
                          color: "#F8F6F0",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                        }}
                      />
                      <button
                        onClick={handleSubmit}
                        className="rounded-xl px-4 py-2.5 flex items-center justify-center"
                        style={{
                          background: "#E8622A",
                          border: "none",
                          cursor: "pointer",
                          color: "#F8F6F0",
                        }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🌊</div>
                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                        fontSize: "20px",
                        fontStyle: "italic",
                        color: "#F8F6F0",
                        marginBottom: "4px",
                      }}
                    >
                      Ci vediamo presto!
                    </p>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "#4A90B8",
                      }}
                    >
                      Il tuo 10% ti aspetta
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="closed"
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
              style={{
                background: "linear-gradient(135deg, #0B2D4E, #4A90B8)",
                border: "1px solid rgba(74, 144, 184, 0.4)",
                cursor: "pointer",
                color: "#F8F6F0",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.93 }}
            >
              <MessageSquare size={22} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
