'use client'

import { useState } from 'react'
import type { RestaurantData } from './types'

export function Hero({ data }: { data: RestaurantData }) {
  const images = data.hero_images ?? [data.hero_image]
  const [expanded, setExpanded] = useState(Math.floor(images.length / 2))

  return (
    <section
      style={{
        position: 'relative',
        height: '100svh',
        background: data.palette.bg,
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {/* Expanding panels — expand-cards (misbahansar / 21st.dev) */}
      {images.map((src, idx) => (
        <div
          key={idx}
          onMouseEnter={() => setExpanded(idx)}
          style={{
            position: 'relative',
            overflow: 'hidden',
            flex: idx === expanded ? '5 1 0' : '0.4 1 0',
            transition: 'flex 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
            cursor: 'pointer',
          }}
        >
          <img
            src={src}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'filter 0.5s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
              filter: idx === expanded ? 'brightness(0.6)' : 'brightness(0.2)',
              transform: idx === expanded ? 'scale(1.02)' : 'scale(1)',
            }}
          />
        </div>
      ))}

      {/* Top overlay: restaurant name + type */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '52px 6vw',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            fontFamily: data.fonts.display,
            fontSize: 'clamp(48px, 6vw, 80px)',
            fontWeight: 400,
            color: data.palette.text,
            margin: 0,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            textShadow: '0 2px 24px rgba(0,0,0,0.7)',
          }}
        >
          {data.restaurant}
        </h1>
        <p
          style={{
            fontFamily: data.fonts.body,
            fontSize: '10px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: data.palette.accent,
            margin: 0,
            paddingTop: '10px',
          }}
        >
          {data.type}
        </p>
      </div>

      {/* Bottom overlay: tagline + city */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0 6vw 56px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: data.fonts.display,
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            fontStyle: 'italic',
            color: data.palette.muted,
            margin: 0,
            textShadow: '0 1px 12px rgba(0,0,0,0.6)',
          }}
        >
          {data.tagline}
        </p>
        <p
          style={{
            fontFamily: data.fonts.body,
            fontSize: '10px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: data.palette.muted,
            opacity: 0.7,
            margin: 0,
          }}
        >
          {data.city}
        </p>
      </div>
    </section>
  )
}
