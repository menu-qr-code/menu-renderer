'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { DishItem, Palette } from './types'

interface Props {
  item: DishItem
  palette: Palette
  fonts: { display: string; body: string }
}

// Core animation system from product-reveal-card (isaiahbjork / 21st.dev)
export function DishCard({ item, palette, fonts }: Props) {
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = !shouldReduceMotion

  const containerVariants = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate ? {
      scale: 1.03,
      y: -8,
      transition: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },
    } : {},
  }

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.08 },
  }

  const overlayVariants = {
    rest: {
      y: '100%',
      opacity: 0,
      filter: 'blur(4px)',
    },
    hover: {
      y: '0%',
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  }

  const contentVariants = {
    rest: { opacity: 0, y: 20, scale: 0.95 },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 400, damping: 25, mass: 0.5 },
    },
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${palette.divider}`,
        background: palette.surface,
        cursor: 'pointer',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        aspectRatio: '3/4',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', height: '65%', overflow: 'hidden' }}>
        <motion.img
          src={item.photo}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          variants={imageVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)',
        }} />
      </div>

      {/* Static info */}
      <div style={{ padding: '16px 18px 18px' }}>
        <p style={{
          fontFamily: fonts.display,
          fontSize: '16px',
          fontWeight: 400,
          color: palette.text,
          margin: '0 0 8px',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
        }}>
          {item.name}
        </p>
        <p style={{
          fontFamily: fonts.body,
          fontSize: '18px',
          fontWeight: 600,
          color: palette.accent,
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          €{item.price}
        </p>
      </div>

      {/* Reveal overlay — slides from bottom on hover */}
      <motion.div
        variants={overlayVariants}
        style={{
          position: 'absolute',
          inset: 0,
          background: `${palette.surface}F8`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '28px 22px',
        }}
      >
        <motion.div variants={contentVariants}>
          <p style={{
            fontFamily: fonts.body,
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: palette.accent,
            margin: '0 0 10px',
          }}>
            €{item.price}
          </p>
          <h4 style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 400,
            color: palette.text,
            margin: '0 0 14px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>
            {item.name}
          </h4>
        </motion.div>
        <motion.div variants={contentVariants}>
          <p style={{
            fontFamily: fonts.body,
            fontSize: '13px',
            lineHeight: 1.65,
            color: palette.muted,
            margin: 0,
          }}>
            {item.description}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
