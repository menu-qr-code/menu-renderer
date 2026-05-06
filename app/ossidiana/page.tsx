"use client"

import React, { useState, useRef, useEffect, createContext, useContext } from 'react'
import {
  motion, AnimatePresence, useScroll, useSpring,
  useTransform, useMotionValue, useVelocity, useAnimationFrame, useInView
} from 'framer-motion'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────────────────────

const MENU = [
  {
    category: "Crudi",
    items: [
      {
        name: "Ostriche Fine de Claires",
        desc: "Normandia n.2 — da 3 pezzi, servite su ghiaccio vivo",
        price: "€4 / pz",
        img: "https://images.unsplash.com/photo-1573225342350-16731dd9bf83?w=600&q=80&auto=format&fit=crop"
      },
      {
        name: "Tartare di Tonno",
        desc: "Avocado, sesamo tostato, wasabi mayo, cipollotto",
        price: "€26",
        img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80&auto=format&fit=crop"
      },
      {
        name: "Carpaccio di Ricciola",
        desc: "Olio al limone, capperi di Pantelleria, rucola selvatica",
        price: "€22",
        img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80&auto=format&fit=crop"
      },
    ]
  },
  {
    category: "Dal Fuoco",
    items: [
      {
        name: "Capesante Scottate",
        desc: "Vellutata di piselli, guanciale croccante, riduzione balsamica",
        price: "€24",
        img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&q=80&auto=format&fit=crop"
      },
      {
        name: "Linguine all'Astice",
        desc: "Bisque intensa, cerfoglio, pomodoro confit al forno",
        price: "€42",
        img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80&auto=format&fit=crop"
      },
      {
        name: "Salmone in Crosta",
        desc: "Erbe alpine, miso bianco invecchiato, brunoise di verdure",
        price: "€28",
        img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop"
      },
    ]
  }
]

// ── BlurReveal (from 21st.dev / badtzx0) ─────────────────────────────────────

function BlurReveal({
  children,
  delay = 0,
  duration = 1,
  className,
}: {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, filter: "blur(12px)", y: "15%" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)", y: "0%" } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  )
}

// ── ParallaxText (from 21st.dev / avanishverma4) ──────────────────────────────

function wrap(min: number, max: number, v: number): number {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity?: number }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)
  const directionFactor = useRef<number>(1)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) directionFactor.current = -1
    else if (velocityFactor.get() > 0) directionFactor.current = 1
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap flex-nowrap will-change-transform uppercase"
      >
        {[...Array(8)].map((_, i) => (
          <span key={i} className="block mr-8 font-light tracking-[0.3em]">{children}</span>
        ))}
      </motion.div>
    </div>
  )
}

// ── 3D Card (from 21st.dev / aceternity) ─────────────────────────────────────

const MouseEnterCtx = createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined)

function CardContainer({ children, className, containerClassName }: { children: React.ReactNode; className?: string; containerClassName?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left - width / 2) / 25
    const y = (e.clientY - top - height / 2) / 25
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
  }
  const handleMouseLeave = () => {
    setIsMouseEntered(false)
    if (containerRef.current) containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`
  }

  return (
    <MouseEnterCtx.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={() => setIsMouseEntered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("relative transition-all duration-200 ease-linear", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterCtx.Provider>
  )
}

function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  )
}

function CardItem({ children, className, translateZ = 0 }: { children: React.ReactNode; className?: string; translateZ?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const context = useContext(MouseEnterCtx)
  const [isMouseEntered] = context ?? [false]

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.transform = isMouseEntered ? `translateZ(${translateZ}px)` : `translateZ(0px)`
  }, [isMouseEntered, translateZ])

  return (
    <div ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)}>
      {children}
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500",
        scrolled
          ? "bg-[#0A0B0F]/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <div
        className="text-[#F5F0E8] tracking-[0.25em] text-sm font-medium"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        OSSIDIANA
      </div>
      <div className="hidden md:flex items-center gap-8">
        <a href="#menu" className="text-[#8B9DB0] hover:text-[#F5F0E8] text-xs tracking-widest uppercase transition-colors">
          Menu
        </a>
        <a href="#about" className="text-[#8B9DB0] hover:text-[#F5F0E8] text-xs tracking-widest uppercase transition-colors">
          About
        </a>
        <a
          href="tel:+390234567890"
          className="text-[#14B8A6] border border-[#14B8A6]/40 text-xs tracking-widest uppercase px-4 py-2 hover:bg-[#14B8A6]/10 transition-colors rounded-sm"
        >
          Prenota
        </a>
      </div>
    </motion.nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0B0F]">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&auto=format&fit=crop')" }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0F]/60 via-transparent to-[#0A0B0F]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.10)_0%,transparent_60%)]" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(20,184,166,0.06)_0%,transparent_40%)]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[#14B8A6] text-xs tracking-[0.5em] uppercase mb-8"
        >
          Raw Bar · Via della Moscova 21 · Milano
        </motion.div>

        <h1
          className="text-[clamp(4.5rem,13vw,11rem)] font-bold text-[#F5F0E8] leading-[0.9] tracking-tight mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <BlurReveal delay={0.4}>OSSI</BlurReveal>
          <BlurReveal delay={0.65}>DIANA</BlurReveal>
        </h1>

        <BlurReveal delay={0.9} className="block">
          <p
            className="text-[#8B9DB0] text-base md:text-lg tracking-[0.25em] font-light mb-14"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Crudo di Mare — Contemporaneo
          </p>
        </BlurReveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex items-center justify-center gap-8"
        >
          <a
            href="#menu"
            className="text-[#F5F0E8] text-sm tracking-widest uppercase pb-1 border-b border-[#14B8A6]/60 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-colors"
          >
            Scopri il Menu
          </a>
          <span className="text-[#8B9DB0]/30 text-lg">·</span>
          <a
            href="#about"
            className="text-[#8B9DB0] text-sm tracking-widest uppercase hover:text-[#F5F0E8] transition-colors"
          >
            La Nostra Storia
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="text-[#8B9DB0]/40 text-[10px] tracking-[0.4em] uppercase">Scorri</span>
        <motion.div
          className="w-px h-14 bg-gradient-to-b from-[#14B8A6]/50 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  )
}

// ── Marquee Section ───────────────────────────────────────────────────────────

function MarqueeSection() {
  return (
    <section className="py-14 bg-[#0A0B0F] border-y border-white/[0.04] overflow-hidden">
      <div
        className="text-[#F5F0E8]/[0.07] text-3xl md:text-5xl font-bold select-none"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        <ParallaxText baseVelocity={-3}>
          CRUDO · OSTRICHE · TARTARE · CARPACCIO · SCAMPI · BOTTARGA · ASTICE · RICCI DI MARE ·
        </ParallaxText>
      </div>
    </section>
  )
}

// ── Dish Card ─────────────────────────────────────────────────────────────────

function DishCard({ name, desc, price, img }: { name: string; desc: string; price: string; img: string }) {
  return (
    <CardContainer containerClassName="w-full py-2">
      <CardBody className="w-full rounded-2xl border border-white/[0.07] bg-[#0D1B2A]/50 backdrop-blur-sm overflow-hidden group hover:border-[#14B8A6]/25 transition-all duration-400 hover:shadow-[0_0_40px_rgba(20,184,166,0.08)]">
        <CardItem translateZ={50} className="w-full overflow-hidden">
          <div className="relative h-52 overflow-hidden">
            <img
              src={img}
              alt={name}
              className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-[#0D1B2A]/20 to-transparent" />
          </div>
        </CardItem>
        <CardItem translateZ={30} className="w-full px-5 pb-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="text-[#F5F0E8] text-lg font-medium leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {name}
            </h3>
            <span className="text-[#14B8A6] text-sm font-light whitespace-nowrap mt-0.5">{price}</span>
          </div>
          <p className="text-[#8B9DB0] text-xs mt-2 leading-relaxed">{desc}</p>
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}

// ── Menu Section ──────────────────────────────────────────────────────────────

function MenuSection() {
  return (
    <section id="menu" className="py-28 bg-[#0A0B0F]">
      <div className="max-w-6xl mx-auto px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-[#14B8A6] text-xs tracking-[0.5em] uppercase mb-4">Stagionale · Selezionato</p>
          <h2
            className="text-[#F5F0E8] text-4xl md:text-5xl font-light"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Il Menu
          </h2>
        </motion.div>

        {MENU.map((section, si) => (
          <div key={si} className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-6 mb-10"
            >
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span
                className="text-[#14B8A6]/80 text-[10px] tracking-[0.5em] uppercase"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {section.category}
              </span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {section.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                >
                  <DishCard {...item} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── About Section (parallax) ─────────────────────────────────────────────────

function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"])

  return (
    <section id="about" ref={ref} className="relative py-36 bg-[#0A0B0F] overflow-hidden">

      {/* Parallax background image */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1600&q=80&auto=format&fit=crop"
          alt="Ossidiana restaurant interior"
          className="w-full h-full object-cover opacity-[0.18]"
        />
      </motion.div>

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0F] via-[#0A0B0F]/50 to-[#0A0B0F]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0F]/80 via-transparent to-[#0A0B0F]" />

      <div className="relative z-10 max-w-4xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[#14B8A6] text-xs tracking-[0.5em] uppercase mb-8">La Nostra Storia</p>
          <h2
            className="text-[#F5F0E8] text-4xl md:text-6xl font-light leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Dove il mare<br />
            <em>incontra l'ossidiana.</em>
          </h2>
          <p className="text-[#8B9DB0] text-base md:text-lg leading-relaxed max-w-xl mb-14">
            Nel cuore di Milano, Ossidiana nasce dalla passione per il crudo di mare e la cucina mediterranea contemporanea. Ogni piatto è una finestra sull'oceano — materia prima selezionata quotidianamente, preparata con rispetto, servita con eleganza sobria.
          </p>

          <div className="flex items-start gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="text-[#F5F0E8] text-4xl font-light mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                12+
              </div>
              <div className="text-[#8B9DB0] text-xs tracking-widest uppercase">Referenze di crudo</div>
            </motion.div>
            <div className="w-px h-14 bg-white/[0.08] mt-2" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="text-[#F5F0E8] text-4xl font-light mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                2019
              </div>
              <div className="text-[#8B9DB0] text-xs tracking-widest uppercase">Anno di apertura</div>
            </motion.div>
            <div className="w-px h-14 bg-white/[0.08] mt-2 hidden md:block" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden md:block"
            >
              <div
                className="text-[#F5F0E8] text-4xl font-light mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Mar — Dom
              </div>
              <div className="text-[#8B9DB0] text-xs tracking-widest uppercase">12:30 · 19:30</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── Footer (animated, from 21st.dev) ─────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#050608] border-t border-white/[0.04] pt-20 pb-10 px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
        >
          {/* Brand */}
          <div>
            <div
              className="text-[#F5F0E8] text-4xl font-light tracking-tight mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              OSSIDIANA
            </div>
            <p className="text-[#8B9DB0] text-sm leading-relaxed">
              Raw Bar & Crudo di Mare.<br />
              Cucina contemporanea, Milano.
            </p>
          </div>

          {/* Info */}
          <div>
            <p className="text-[#14B8A6]/70 text-[10px] tracking-widest uppercase mb-4">Dove siamo</p>
            <p className="text-[#8B9DB0] text-sm mb-1">Via della Moscova 21</p>
            <p className="text-[#8B9DB0] text-sm mb-1">20121 Milano</p>
            <p className="text-[#8B9DB0] text-sm mt-4">Mar – Dom</p>
            <p className="text-[#8B9DB0] text-sm">12:30–15:00 · 19:30–23:30</p>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-[#14B8A6]/70 text-[10px] tracking-widest uppercase mb-4">Contatti</p>
            <a href="tel:+39023456789" className="block text-[#8B9DB0] hover:text-[#F5F0E8] text-sm mb-2 transition-colors">
              +39 02 3456 789
            </a>
            <a href="mailto:info@ossidiana.it" className="block text-[#8B9DB0] hover:text-[#F5F0E8] text-sm mb-2 transition-colors">
              info@ossidiana.it
            </a>
            <a href="#" className="block text-[#8B9DB0] hover:text-[#14B8A6] text-sm transition-colors">
              @ossidiana_milano
            </a>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
        >
          <p className="text-[#8B9DB0]/30 text-xs">
            © 2026 Ossidiana. Tutti i diritti riservati.
          </p>
          <p className="text-[#8B9DB0]/25 text-xs">
            Menu digitale powered by{" "}
            <span className="text-[#14B8A6]/40">QRMenu</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

// ── Contact Popup ─────────────────────────────────────────────────────────────

function ContactPopup() {
  const [visible, setVisible] = useState(false)
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [dismissed])

  const handleClose = () => {
    setVisible(false)
    setDismissed(true)
  }

  const handleSubmit = () => {
    if (phone.length < 8) return
    setSubmitted(true)
    setTimeout(() => {
      setVisible(false)
      setDismissed(true)
    }, 2200)
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed inset-x-4 bottom-6 md:inset-auto md:bottom-8 md:right-8 md:w-[320px] z-[101]"
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <div className="bg-[#0D1B2A] border border-[#14B8A6]/20 rounded-2xl p-6 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
              {/* Teal top accent */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-[#14B8A6]/40 rounded-full" />

              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-[#8B9DB0]/60 hover:text-[#F5F0E8] transition-colors text-sm"
              >
                ✕
              </button>

              {!submitted ? (
                <>
                  <p className="text-[#14B8A6] text-[10px] tracking-[0.4em] uppercase mb-3">Offerta esclusiva</p>
                  <h3
                    className="text-[#F5F0E8] text-xl mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Hai mangiato bene?
                  </h3>
                  <p className="text-[#8B9DB0] text-sm mb-5 leading-relaxed">
                    Lasciaci il tuo numero e ricevi{" "}
                    <strong className="text-[#14B8A6]">-10% sul prossimo ritorno</strong>.
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="tel"
                      placeholder="+39 333 123 4567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      className="flex-1 bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2.5 text-[#F5F0E8] text-sm placeholder:text-[#8B9DB0]/40 focus:outline-none focus:border-[#14B8A6]/40 transition-colors"
                    />
                    <button
                      onClick={handleSubmit}
                      className="bg-[#14B8A6] text-[#0A0B0F] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#14B8A6]/85 transition-colors"
                    >
                      OK
                    </button>
                  </div>
                  <p className="text-[#8B9DB0]/30 text-[11px]">
                    Nessuno spam. I tuoi dati sono al sicuro.
                  </p>
                </>
              ) : (
                <motion.div
                  className="text-center py-5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    🌊
                  </motion.div>
                  <p
                    className="text-[#F5F0E8] text-xl mb-1"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    Grazie!
                  </p>
                  <p className="text-[#8B9DB0] text-sm">Il tuo sconto è riservato.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OssidianaPage() {
  return (
    <main className="bg-[#0A0B0F] min-h-screen">
      <Navbar />
      <Hero />
      <MarqueeSection />
      <MenuSection />
      <AboutSection />
      <Footer />
      <ContactPopup />
    </main>
  )
}
