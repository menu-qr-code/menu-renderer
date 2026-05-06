'use client'

import { useEffect } from 'react'
import { Hero } from './Hero'
import { Nav } from './Nav'
import { Section } from './Section'
import type { RestaurantData } from './types'

export function MenuClient({ data }: { data: RestaurantData }) {
  useEffect(() => {
    const existing = document.getElementById('menu-fonts')
    if (existing) return

    const link = document.createElement('link')
    link.id = 'menu-fonts'
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(data.fonts.display)}:ital,wght@0,400;0,500;0,700;1,400&family=${encodeURIComponent(data.fonts.body)}:wght@300;400;500&display=swap`
    document.head.appendChild(link)
  }, [data.fonts])

  return (
    <div
      style={{
        background: data.palette.bg,
        color: data.palette.text,
        minHeight: '100svh',
      }}
    >
      <Nav data={data} />
      <Hero data={data} />

      {data.sections.map((section, i) => (
        <Section
          key={section.id}
          section={section}
          index={i}
          palette={data.palette}
          fonts={data.fonts}
        />
      ))}

      {/* Footer */}
      <footer
        style={{
          padding: '56px 6vw 48px',
          borderTop: `1px solid ${data.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: data.fonts.display,
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 400,
            color: data.palette.accent,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {data.restaurant}
        </p>
        <p
          style={{
            fontFamily: data.fonts.body,
            fontSize: '11px',
            color: data.palette.muted,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {data.city}
        </p>
        <p
          style={{
            fontFamily: data.fonts.body,
            fontSize: '11px',
            color: data.palette.muted,
            opacity: 0.5,
            marginTop: '16px',
          }}
        >
          I prezzi sono IVA inclusa. Si prega di informare il personale di eventuali allergie.
        </p>
      </footer>
    </div>
  )
}
