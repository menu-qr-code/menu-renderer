"use client"

import { useEffect, useRef, useState } from "react"
import type { RestaurantParams, MenuItem } from "@/lib/types"
import { LoyaltyPopupClient } from "./LoyaltyPopupClient"

const UNSPLASH = {
  hero:    "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=1200&q=85&fit=crop",
  dark1:   "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=85&fit=crop",
  dark2:   "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=900&q=85&fit=crop",
  dark3:   "https://images.unsplash.com/photo-1559628233-100c798642d8?w=900&q=85&fit=crop",
  dark4:   "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=900&q=85&fit=crop",
  dark5:   "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=85&fit=crop",
}

const ITEM_IMAGES = [UNSPLASH.dark1, UNSPLASH.dark2, UNSPLASH.dark3, UNSPLASH.dark4, UNSPLASH.dark5]

export function CinematicMenu({ restaurant: r }: { restaurant: RestaurantParams }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const accent = r.accent_color
  const bg = r.primary_palette[0]
  const bg2 = r.primary_palette[1] ?? "#131313"
  const text = r.text_color
  const muted = r.description_color

  return (
    <div style={{ background: bg, color: text, overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          height: "100svh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Immagine hero con parallax */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${UNSPLASH.hero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.35}px)`,
          willChange: "transform",
          filter: "brightness(0.35)",
        }} />

        {/* Gradient bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "70%",
          background: `linear-gradient(to top, ${bg} 0%, transparent 100%)`,
        }} />

        {/* Grain */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: "256px",
        }} />

        {/* Video banner */}
        {!r.has_video && r.video_integration && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
            background: accent, color: bg,
            padding: "13px 24px",
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "var(--font-grotesk), sans-serif",
            fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
          }}>
            <span>▶</span><span>{r.video_integration}</span>
          </div>
        )}

        {/* Testo hero */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 24px 60px" }}>
          <FadeIn delay={0}>
            <p style={{
              fontFamily: "var(--font-grotesk), sans-serif",
              fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase",
              color: accent, marginBottom: 16,
            }}>
              {r.city} — {r.type}
            </p>
          </FadeIn>
          <FadeIn delay={120}>
            <h1 ref={titleRef} style={{
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(76px, 22vw, 120px)",
              fontWeight: 400, lineHeight: 0.88,
              letterSpacing: "-0.04em",
              color: text, marginBottom: 32,
            }}>
              {r.restaurant}
            </h1>
          </FadeIn>
          <FadeIn delay={240}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 40, height: 1, background: accent }} />
              <p style={{
                fontFamily: "var(--font-grotesk), sans-serif",
                fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
                color: muted,
              }}>
                Scorri per scoprire
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <ScrollArrow color={accent} />
      </section>

      {/* ── COCKTAIL SECTIONS ── */}
      {r.menu_items?.map((item, i) => (
        <CocktailSection
          key={i}
          item={item}
          index={i}
          bg={bg}
          bg2={bg2}
          accent={accent}
          text={text}
          muted={muted}
          image={item.mystery ? undefined : ITEM_IMAGES[i % ITEM_IMAGES.length]}
        />
      ))}

      {/* ── FOOTER ── */}
      <footer style={{
        padding: "64px 24px",
        borderTop: `1px solid rgba(201,168,76,0.1)`,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <p style={{ fontFamily: "var(--font-serif), serif", fontSize: 28, color: text, fontWeight: 400 }}>
          {r.restaurant}
        </p>
        <p style={{ fontFamily: "var(--font-grotesk), sans-serif", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: muted }}>
          {r.city}
        </p>
      </footer>

      <LoyaltyPopupClient
        restaurantName={r.restaurant}
        accentColor={accent}
        bgColor={bg2}
        textColor={text}
        mutedColor={muted}
      />
    </div>
  )
}

// ── Cocktail section full-height ──
function CocktailSection({ item, index, bg, bg2, accent, text, muted, image }: {
  item: MenuItem
  index: number
  bg: string
  bg2: string
  accent: string
  text: string
  muted: string
  image?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (item.mystery) {
    return (
      <section ref={ref} style={{
        minHeight: "100svh",
        background: bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 24px",
        borderTop: `1px solid rgba(201,168,76,0.08)`,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.9)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          textAlign: "center",
        }}>
          <MysteryBox accent={accent} muted={muted} name={item.name} price={item.price} />
        </div>
      </section>
    )
  }

  const isEven = index % 2 === 0

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100svh",
        display: "grid",
        gridTemplateColumns: "1fr",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid rgba(201,168,76,0.08)`,
      }}
    >
      {/* Immagine di sfondo */}
      {image && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.25) saturate(0.8)",
          transform: visible ? "scale(1)" : "scale(1.05)",
          transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      )}

      {/* Tint del colore del cocktail */}
      <div style={{
        position: "absolute", inset: 0,
        background: item.color_hint
          ? `radial-gradient(ellipse at ${isEven ? "30%" : "70%"} 60%, ${item.color_hint}55 0%, transparent 65%)`
          : "none",
      }} />

      {/* Gradient testo leggibilità */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to top, ${bg}ee 0%, ${bg}99 40%, transparent 100%)`,
      }} />

      {/* Contenuto */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 24px 56px",
        minHeight: "100svh",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        transitionDelay: "0.1s",
      }}>
        <p style={{
          fontFamily: "var(--font-grotesk), sans-serif",
          fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase",
          color: accent, marginBottom: 14,
        }}>
          N°{String(index + 1).padStart(2, "0")}
        </p>

        <h2 style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: "clamp(40px, 11vw, 68px)",
          fontWeight: 400, lineHeight: 0.95,
          letterSpacing: "-0.02em",
          color: text, marginBottom: 24,
        }}>
          {item.name}
        </h2>

        {item.ingredients && (
          <p style={{
            fontFamily: "var(--font-grotesk), sans-serif",
            fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase",
            color: muted, lineHeight: 1.9, marginBottom: 20,
            maxWidth: "34ch",
          }}>
            {item.ingredients}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {item.note ? (
            <p style={{
              fontFamily: "var(--font-grotesk), sans-serif",
              fontSize: 12, fontStyle: "italic",
              color: muted, opacity: 0.7, maxWidth: "28ch",
            }}>
              "{item.note}"
            </p>
          ) : <div />}
          <span style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: 28, color: accent,
          }}>
            €{item.price}
          </span>
        </div>
      </div>
    </section>
  )
}

// ── Mystery box ──
function MysteryBox({ accent, muted, name, price }: { accent: string; muted: string; name: string; price: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{
        width: 96, height: 96,
        border: `1px solid ${accent}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "pulse-gold 3s ease-in-out infinite",
      }}>
        <span style={{ color: accent, fontSize: 40, fontFamily: "var(--font-serif), serif" }}>?</span>
      </div>
      <div>
        <p style={{ fontFamily: "var(--font-serif), serif", fontSize: 32, color: accent, marginBottom: 8 }}>
          {name}
        </p>
        <p style={{ fontFamily: "var(--font-grotesk), sans-serif", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: muted, marginBottom: 16 }}>
          Ricetta segreta
        </p>
        <p style={{ fontFamily: "var(--font-serif), serif", fontSize: 22, color: accent }}>
          €{price}
        </p>
      </div>
    </div>
  )
}

// ── Scroll arrow ──
function ScrollArrow({ color }: { color: string }) {
  return (
    <div style={{
      position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
      zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center",
      animation: "bounce 2s ease-in-out infinite",
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v14M4 11l6 6 6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

// ── Fade-in on mount ──
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [v, setV] = useState(false)
  useEffect(() => { const t = setTimeout(() => setV(true), 300 + delay); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.9s ease, transform 0.9s ease",
    }}>
      {children}
    </div>
  )
}
