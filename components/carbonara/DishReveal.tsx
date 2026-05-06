"use client"

import { motion } from "motion/react"

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
}

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
}

export default function DishReveal() {
  return (
    <section className="min-h-screen bg-black flex flex-col items-center justify-center px-8 py-28">
      <motion.div
        className="flex flex-col items-center text-center gap-7 max-w-md"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.p
          variants={fadeUp}
          className="text-white/35 text-[10px] tracking-[0.45em] uppercase font-light"
        >
          Primo piatto della casa
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-white font-light tracking-tight leading-[1.0]"
          style={{ fontSize: "clamp(3rem, 10vw, 5.5rem)" }}
        >
          Carbonara
        </motion.h1>

        <motion.div
          variants={lineReveal}
          className="w-10 h-[1px] bg-white/25 origin-left"
        />

        <motion.p
          variants={fadeUp}
          className="text-white/45 text-sm leading-[1.8] max-w-[40ch]"
        >
          Guanciale croccante, tuorlo d'uovo fresco, pecorino romano stagionato
          24 mesi, pepe nero macinato al momento. Una ricetta immutabile dal 1944.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex items-center gap-4 mt-2"
        >
          <span className="text-white/25 text-xs tracking-[0.3em] uppercase">Prezzo</span>
          <span className="text-white/80 text-xl font-light">€ 16</span>
        </motion.div>
      </motion.div>
    </section>
  )
}
