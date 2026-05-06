"use client";

import { useEffect, useState } from "react";
import { GradientBackground } from "@/components/buozzi/GradientBackground";
import { FloatingNav } from "@/components/buozzi/FloatingNav";
import { ImagesSlider } from "@/components/buozzi/ImagesSlider";
import { VerticalCutReveal } from "@/components/buozzi/VerticalCutReveal";
import { ParallaxText } from "@/components/buozzi/ParallaxText";
import { BlurReveal } from "@/components/buozzi/BlurReveal";
import ScrollAnimation from "@/components/buozzi/ScrollAnimation";
import { MenuItemCard } from "@/components/buozzi/MenuItemCard";
import { PiattoDrawer } from "@/components/buozzi/PiattoDrawer";
import { PromoModal } from "@/components/buozzi/PromoModal";
import { PALETTE as C, PIATTI, HERO_IMAGES } from "@/components/buozzi/data";

// ─── Page ───────────────────────────────────────
export default function BuozziPage() {
  const [selectedPiatto, setSelectedPiatto] = useState<typeof PIATTI[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPromoOpen(true), 25000);
    return () => clearTimeout(timer);
  }, []);

  const handlePiattoClick = (piatto: typeof PIATTI[0]) => {
    setSelectedPiatto(piatto);
    setDrawerOpen(true);
  };

  const categorie = [...new Set(PIATTI.map((p) => p.categoria))];

  return (
    <GradientBackground className="min-h-screen">
      <FloatingNav />

      {/* ── HERO ── */}
      <section style={{ height: "100vh", position: "relative" }}>
        <ImagesSlider images={HERO_IMAGES} className="h-screen">
          <div
            style={{
              position: "relative",
              zIndex: 50,
              textAlign: "center",
              padding: "0 24px",
            }}
          >
            <p
              style={{
                color: C.terracotta,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Osteria Tradizionale · Roma, Prati · Dal 1978
            </p>

            <h1
              style={{
                color: C.cream,
                fontSize: "clamp(72px, 16vw, 140px)",
                fontWeight: 900,
                lineHeight: 0.9,
                margin: "0 0 28px",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                fontFamily: "Georgia, serif",
              }}
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.12}
                transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.3 }}
              >
                OSTERIA BUOZZI
              </VerticalCutReveal>
            </h1>

            <p
              style={{
                color: C.muted,
                fontSize: 16,
                lineHeight: 1.7,
                maxWidth: 380,
                margin: "0 auto 40px",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
              }}
            >
              <BlurReveal delay={1.2}>
                La cucina della nonna.<br />Nessuna abbreviazione. Solo materia.
              </BlurReveal>
            </p>

            <a
              href="#menu"
              style={{
                display: "inline-block",
                color: C.cream,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "13px 36px",
                border: `1px solid ${C.terracotta}`,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.terracotta)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              Scopri il menù
            </a>
          </div>
        </ImagesSlider>
      </section>

      {/* ── TICKER ── */}
      <div
        style={{
          background: C.bg,
          padding: "18px 0",
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          overflow: "hidden",
        }}
      >
        <ParallaxText baseVelocity={-3}>
          <span
            style={{
              color: C.terracotta,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "Georgia, serif",
            }}
          >
            CACIO E PEPE • CARBONARA • CODA ALLA VACCINARA • SUPPLÌ • ABBACCHIO • VINO DELLA CASA •
          </span>
        </ParallaxText>
      </div>

      {/* ── MANIFESTO ── */}
      <section
        id="manifesto"
        style={{
          background: C.bg,
          padding: "100px 32px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <ScrollAnimation direction="left" delay={0}>
              <p
                style={{
                  color: C.terracotta,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                La nostra filosofia
              </p>
              <h2
                style={{
                  color: C.cream,
                  fontSize: "clamp(36px, 5vw, 58px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  margin: "0 0 28px",
                  fontFamily: "Georgia, serif",
                }}
              >
                <VerticalCutReveal
                  splitBy="words"
                  staggerDuration={0.15}
                  transition={{ type: "spring", stiffness: 160, damping: 20 }}
                >
                  Non siamo una catena.
                </VerticalCutReveal>
                <br />
                <VerticalCutReveal
                  splitBy="words"
                  staggerDuration={0.15}
                  transition={{ type: "spring", stiffness: 160, damping: 20, delay: 0.3 }}
                >
                  Siamo una cucina.
                </VerticalCutReveal>
              </h2>
              <p
                style={{
                  color: C.muted,
                  fontSize: 16,
                  lineHeight: 1.8,
                  maxWidth: 420,
                  fontFamily: "Georgia, serif",
                }}
              >
                <BlurReveal delay={0.2}>
                  Dal 1978 cuciniamo come si faceva a casa: con il soffritto che parte la mattina,
                  il guanciale comprato dal macellaio di fiducia, il pecorino grattugiato al momento.
                  Nessun piatto surgelato. Mai.
                </BlurReveal>
              </p>
            </ScrollAnimation>
          </div>

          <ScrollAnimation direction="right" delay={0.1}>
            <div style={{ position: "relative", height: 420 }}>
              <img
                src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=700&q=80"
                alt="Interno Osteria Buozzi"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 2,
                  filter: "brightness(0.75) sepia(0.2)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, rgba(196,80,42,0.08) 0%, transparent 60%)`,
                  borderRadius: 2,
                }}
              />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ── MENU ── */}
      <section
        id="menu"
        style={{
          background: C.bg,
          padding: "60px 32px 120px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <ScrollAnimation direction="up" delay={0}>
          <h2
            style={{
              color: C.cream,
              fontSize: "clamp(44px, 7vw, 76px)",
              fontWeight: 700,
              textTransform: "uppercase",
              margin: "0 0 60px",
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.01em",
            }}
          >
            Il Menù
          </h2>
        </ScrollAnimation>

        {categorie.map((cat) => (
          <div key={cat} style={{ marginBottom: 56 }}>
            <ScrollAnimation direction="up" delay={0}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <p
                  style={{
                    color: C.terracotta,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {cat}
                </p>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>
            </ScrollAnimation>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {PIATTI.filter((p) => p.categoria === cat).map((piatto, i) => (
                <ScrollAnimation key={piatto.nome} direction="up" delay={i * 0.08}>
                  <MenuItemCard
                    imageUrl={piatto.img}
                    name={piatto.nome}
                    prezzo={piatto.prezzo}
                    desc={piatto.desc}
                    tag={piatto.tag}
                    onCardClick={() => handlePiattoClick(piatto)}
                  />
                </ScrollAnimation>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── CONTATTI ── */}
      <section
        id="contatti"
        style={{
          background: C.bg,
          padding: "80px 32px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <ScrollAnimation direction="up" delay={0}>
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: C.terracotta,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              Dove siamo
            </p>
            <h2
              style={{
                color: C.cream,
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 700,
                margin: "0 0 28px",
                fontFamily: "Georgia, serif",
              }}
            >
              Vieni a trovarci
            </h2>
            <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Via Candia 18, Roma (Prati)<br />
              Lun–Sab: 12:30–15:00 · 19:30–23:00<br />
              Dom: 12:30–15:00
            </p>
            <a
              href="tel:+390612345678"
              style={{
                display: "inline-block",
                color: C.cream,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "13px 36px",
                border: `1px solid ${C.terracotta}`,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.terracotta)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              +39 06 12345678
            </a>
          </div>
        </ScrollAnimation>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          background: "#0F0906",
          borderTop: `1px solid ${C.border}`,
          padding: "32px",
          textAlign: "center",
        }}
      >
        <p style={{ color: C.muted, fontSize: 12, margin: 0, letterSpacing: "0.08em" }}>
          OSTERIA BUOZZI — Via Candia 18, Roma · +39 06 12345678 · info@osteriabuozzi.it
        </p>
        <p style={{ color: "#5A3828", fontSize: 11, marginTop: 8 }}>
          Dal 1978, con lo stesso soffritto.
        </p>
      </footer>

      {/* ── MODALI ── */}
      <PiattoDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        piatto={selectedPiatto}
      />

      <PromoModal
        isOpen={promoOpen}
        onClose={() => setPromoOpen(false)}
      />
    </GradientBackground>
  );
}
