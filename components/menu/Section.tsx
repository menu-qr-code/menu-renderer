'use client'

import { motion } from 'framer-motion'
import { DishCard } from './DishCard'
import type { MenuSection as MenuSectionType, Palette } from './types'

interface Props {
  section: MenuSectionType
  index: number
  palette: Palette
  fonts: { display: string; body: string }
}

export function Section({ section, index, palette, fonts }: Props) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <section
      id={section.id}
      style={{ padding: '88px 6vw 72px' }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: '52px' }}
      >
        <p
          style={{
            fontFamily: fonts.body,
            fontSize: '10px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: palette.accent,
            marginBottom: '14px',
          }}
        >
          {num}
        </p>
        <h2
          style={{
            fontFamily: fonts.display,
            fontSize: 'clamp(44px, 7vw, 80px)',
            fontWeight: 400,
            color: palette.text,
            letterSpacing: '-0.025em',
            lineHeight: 0.95,
            margin: '0 0 28px',
          }}
        >
          {section.title}
        </h2>
        <div
          style={{
            height: '1px',
            background: palette.divider,
            width: '100%',
          }}
        />
      </motion.div>

      {/* Dish grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          maxWidth: '900px',
        }}
        className="sm:gap-4 md:grid-cols-3"
      >
        {section.items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <DishCard item={item} palette={palette} fonts={fonts} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
