"use client"

import type { RestaurantParams } from "@/lib/types"

export function HeroBoldTypography({ params }: { params: RestaurantParams }) {
  return (
    <section
      className="relative w-full flex flex-col justify-center px-6"
      style={{ minHeight: "100svh", background: "var(--color-bg)" }}
    >
      <p
        className="uppercase text-xs mb-8"
        style={{ color: "var(--color-accent)", letterSpacing: "0.4em" }}
      >
        {params.city}
      </p>

      <h1
        className="leading-none"
        style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: "clamp(64px, 18vw, 140px)",
          fontWeight: 700,
          letterSpacing: "-0.05em",
          color: "var(--color-text)",
          lineHeight: 0.9,
        }}
      >
        {params.restaurant}
      </h1>

      <div
        className="mt-10 w-full h-px"
        style={{ background: "var(--divider)" }}
      />

      <p
        className="mt-6 text-sm max-w-xs"
        style={{ color: "var(--color-muted)", lineHeight: 1.6 }}
      >
        {params.type}
      </p>
    </section>
  )
}
