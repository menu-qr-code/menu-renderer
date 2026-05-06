'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { RestaurantData } from './types'

export function Nav({ data }: { data: RestaurantData }) {
  const [visible, setVisible] = useState(false)
  const [active, setActive] = useState(data.sections[0].id)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.75)

      for (let i = data.sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(data.sections[i].id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) {
          setActive(data.sections[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [data.sections])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5vw',
            background: `${data.palette.bg}F0`,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: `1px solid ${data.palette.divider}`,
          }}
        >
          <span
            style={{
              fontFamily: data.fonts.display,
              fontSize: '15px',
              color: data.palette.text,
              letterSpacing: '0.03em',
            }}
          >
            {data.restaurant}
          </span>

          <div
            style={{
              display: 'flex',
              gap: '2px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {data.sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  fontFamily: data.fonts.body,
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  background: active === s.id ? data.palette.accent : 'transparent',
                  color: active === s.id ? '#fff' : data.palette.muted,
                  transition: 'background 0.2s, color 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
