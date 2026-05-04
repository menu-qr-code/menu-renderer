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
      const progress = window.scrollY / maxScroll
      video.currentTime = progress * video.duration
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100svh", background: "var(--color-bg)" }}
    >
      {/* Banner video placeholder finché il titolare non carica il video */}
      {params.has_video ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          muted
          playsInline
          preload="auto"
        />
      ) : (
        <div
          className="absolute top-0 left-0 right-0 flex items-center gap-3 px-6 py-4 text-xs uppercase tracking-widest"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-bg)",
            letterSpacing: "0.2em",
          }}
        >
          <span>▶</span>
          <span>{params.video_integration ?? "Carica il tuo video dalla dashboard"}</span>
        </div>
      )}

      <div
        className="relative z-10 flex flex-col justify-end px-6 pb-16"
        style={{ minHeight: "100svh" }}
      >
        <p
          className="uppercase text-xs mb-6"
          style={{ color: "var(--color-accent)", letterSpacing: "0.3em" }}
        >
          {params.city}
        </p>
        <h1
          className="leading-none mb-8"
          style={{
            fontFamily: "serif",
            fontSize: "clamp(56px, 14vw, 96px)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            color: "var(--color-text)",
          }}
        >
          {params.restaurant}
        </h1>
      </div>
    </section>
  )
}
