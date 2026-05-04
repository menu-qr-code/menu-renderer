"use client"

import type { RestaurantParams } from "@/lib/types"

export function HeroCinematic({ params }: { params: RestaurantParams }) {
  return (
    <section
      className="relative w-full flex flex-col justify-end overflow-hidden"
      style={{ minHeight: "100svh", background: "var(--color-bg)" }}
    >
      {/* Foto placeholder — il titolare caricherà la sua */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: params.special_elements?.hero_photo
            ? undefined
            : "none",
          opacity: 0.6,
        }}
      />

      {/* Grain cinematico */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="relative z-10 px-6 pb-16 pt-8">
        <p
          className="uppercase tracking-widest text-xs mb-6"
          style={{ color: "var(--color-accent)", letterSpacing: "0.3em" }}
        >
          {params.city} — {params.type}
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
        <div
          className="w-16 h-px"
          style={{ background: "var(--color-accent)" }}
        />
      </div>
    </section>
  )
}
