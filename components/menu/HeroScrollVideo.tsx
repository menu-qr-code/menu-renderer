"use client"

import { useEffect, useRef } from "react"
import type { RestaurantParams } from "@/lib/types"

export function HeroScrollVideo({ params }: { params: RestaurantParams }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return
      video.currentTime = (window.scrollY / maxScroll) * video.duration
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section style={{ position: "relative", minHeight: "100svh", background: params.primary_palette[0], overflow: "hidden" }}>

      {/* Gradient cinematico — sostituito da foto/video reale quando disponibile */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse at 20% 80%, rgba(201,168,76,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.04) 0%, transparent 50%),
          linear-gradient(180deg, ${params.primary_palette[0]} 0%, ${params.primary_palette[1]} 100%)
        `,
      }} />

      {/* Grain */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px",
        pointerEvents: "none",
      }} />

      {/* Banner video */}
      {!params.has_video && params.video_integration && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 24px",
          background: params.accent_color,
          color: params.primary_palette[0],
          fontFamily: "var(--font-grotesk), sans-serif",
          fontSize: "10px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          zIndex: 10,
        }}>
          <span>▶</span>
          <span>{params.video_integration}</span>
        </div>
      )}

      {/* Video reale (quando caricato dal titolare) */}
      {params.has_video && (
        <video
          ref={videoRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
          muted
          playsInline
          preload="auto"
        />
      )}

      {/* Contenuto hero */}
      <div style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 24px 64px",
      }}>
        <p style={{
          fontFamily: "var(--font-grotesk), sans-serif",
          fontSize: "10px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: params.accent_color,
          marginBottom: 20,
        }}>
          {params.city}
        </p>

        <h1 style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: "clamp(60px, 16vw, 100px)",
          fontWeight: 400,
          letterSpacing: "-0.04em",
          lineHeight: 0.95,
          color: params.text_color,
          marginBottom: 32,
        }}>
          {params.restaurant}
        </h1>

        <div style={{ width: 48, height: 1, background: params.accent_color }} />
      </div>
    </section>
  )
}
