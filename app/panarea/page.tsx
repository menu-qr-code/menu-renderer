"use client";

import { useState, useEffect } from "react";
import { CinematicLandingHero } from "@/components/panarea/CinematicLandingHero";
import { StarsCanvas } from "@/components/panarea/StarsCanvas";
import { LiquidGlassCard } from "@/components/panarea/LiquidGlassCard";
import { BlurReveal } from "@/components/panarea/BlurReveal";
import SlidingTabs from "@/components/panarea/SlidingTabs";
import { AnimatedModal } from "@/components/panarea/AnimatedModal";
import { ParallaxSection } from "@/components/panarea/Parallax";
import { KineticScrollGallery } from "@/components/panarea/KineticScrollGallery";
import { FloatingChatWidgetShadcnui } from "@/components/panarea/FloatingChatWidgetShadcnui";
import { ShimmerButton } from "@/components/panarea/ShimmerButton";
import {
  PIATTI,
  GALLERY_IMAGES,
  PARALLAX_IMAGE,
} from "@/components/panarea/data";
import type { PiattoData } from "@/components/panarea/LiquidGlassCard";

export default function PanareaPage() {
  const [selectedPiatto, setSelectedPiatto] = useState<PiattoData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const categorie = [...new Set(PIATTI.map((p) => p.categoria))];

  const tabItems = categorie.map((cat, i) => ({
    key: cat,
    label: cat,
    panel: (
      <div
        className="grid gap-4 mt-6"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {PIATTI.filter((p) => p.categoria === cat).map((piatto) => (
          <LiquidGlassCard
            key={piatto.id}
            piatto={piatto}
            onClick={(p) => { setSelectedPiatto(p); setModalOpen(true); }}
          />
        ))}
      </div>
    ),
  }));

  const scrollToMenu = () => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      style={{
        background: "#0D1B2A",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Sfondo stellato fisso */}
      <StarsCanvas hue={210} brightness={8} transparent={false} />

      {/* ── HERO ── */}
      <CinematicLandingHero
        title="Panarea"
        subtitle="Napoli · Chiaia"
        tagline="L'isola nel piatto"
        imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80"
        ctaText="Sfoglia il Menu"
        onCtaClick={scrollToMenu}
      />

      {/* ── GALLERIA ── */}
      <KineticScrollGallery images={GALLERY_IMAGES} />

      {/* ── HEADLINE MENU ── */}
      <section
        id="menu"
        className="px-6 pt-24 pb-4 max-w-6xl mx-auto"
        style={{ position: "relative", zIndex: 10 }}
      >
        <BlurReveal delay={0}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(40px, 7vw, 64px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#F8F6F0",
              marginBottom: "8px",
            }}
          >
            Il Menu
          </h2>
        </BlurReveal>
        <BlurReveal delay={0.2}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 300,
              color: "#A8A099",
              letterSpacing: "0.08em",
              marginBottom: "32px",
            }}
          >
            Tocca un piatto per scoprire ingredienti e storia
          </p>
        </BlurReveal>

        {/* Tab navigazione */}
        <SlidingTabs
          items={tabItems}
          defaultIndex={0}
          onChange={setActiveTab}
        />
      </section>

      {/* ── SEPARATORE PARALLAX ── */}
      <ParallaxSection
        imageUrl={PARALLAX_IMAGE}
        className="my-16"
      >
        <BlurReveal>
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#F8F6F0",
              textAlign: "center",
              maxWidth: "600px",
              padding: "0 24px",
            }}
          >
            "Il vulcano è il forno, il mare è il condimento"
          </blockquote>
        </BlurReveal>
      </ParallaxSection>

      {/* ── CTA PRENOTAZIONE ── */}
      <section
        className="flex flex-col items-center py-20 px-6"
        style={{ position: "relative", zIndex: 10 }}
      >
        <BlurReveal delay={0}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#4A90B8",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            Napoli · Chiaia · Via Domenico Morelli 48
          </p>
        </BlurReveal>
        <BlurReveal delay={0.2}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#F8F6F0",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            Prenota un tavolo
          </h2>
        </BlurReveal>

        <ShimmerButton
          onClick={() => { window.open("tel:+390817601234", "_self"); }}
        >
          Chiama ora
        </ShimmerButton>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            fontWeight: 300,
            color: "#A8A099",
            marginTop: "16px",
          }}
        >
          Lun–Dom · 12:30–15:00 · 19:30–23:30
        </p>
      </section>

      {/* ── MODAL DETTAGLIO PIATTO ── */}
      <AnimatedModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        piatto={selectedPiatto}
      />

      {/* ── POPUP RACCOLTA CONTATTI ── */}
      <FloatingChatWidgetShadcnui
        offerTitle="Torna a Panarea"
        offerDescription="Lascia il numero per ricevere il 10% di sconto alla prossima visita. Solo per i nostri ospiti."
        triggerDelay={28000}
      />
    </main>
  );
}
