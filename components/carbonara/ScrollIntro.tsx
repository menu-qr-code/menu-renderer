"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const FRAME_COUNT = 121
const framePath = (i: number) =>
  `/frames/carbonara/frame_${String(i + 1).padStart(4, "0")}.jpg`

export default function ScrollIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const tickingRef = useRef(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  function resizeCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
  }

  function draw(img: HTMLImageElement) {
    const canvas = canvasRef.current
    if (!canvas || !img.complete) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const ia = img.naturalWidth / img.naturalHeight
    const ca = w / h
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight
    if (ia > ca) {
      sw = img.naturalHeight * ca
      sx = (img.naturalWidth - sw) / 2
    } else {
      sh = img.naturalWidth / ca
      sy = (img.naturalHeight - sh) / 2
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let done = 0
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = framePath(i)
      img.onload = () => {
        done++
        setLoadProgress(done / FRAME_COUNT)
        if (done === FRAME_COUNT) {
          imagesRef.current = images
          setReady(true)
          draw(images[0])
        }
      }
      images[i] = img
    }

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  useEffect(() => {
    if (!ready) return

    function onScroll() {
      if (tickingRef.current) return
      tickingRef.current = true
      requestAnimationFrame(() => {
        const section = sectionRef.current
        if (section) {
          const rect = section.getBoundingClientRect()
          const progress = Math.max(
            0,
            Math.min(1, -rect.top / (section.offsetHeight - window.innerHeight))
          )
          const index = Math.min(
            Math.floor(progress * FRAME_COUNT),
            FRAME_COUNT - 1
          )
          draw(imagesRef.current[index])

          // Fade out "Osteria Roma" in the first 8% of scroll
          if (heroTextRef.current) {
            const opacity = Math.max(0, 1 - progress / 0.08)
            heroTextRef.current.style.opacity = String(opacity)
          }
        }
        tickingRef.current = false
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [ready])

  return (
    <section ref={sectionRef} style={{ height: "400vh" }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

        {/* Loading screen */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center"
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              {/* First frame blurred as bg */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/frames/carbonara/frame_0001.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: "blur(14px)", transform: "scale(1.15)" }}
                />
              </motion.div>

              {/* Dark vignette */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Restaurant name */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <motion.p
                  className="text-white/35 text-[9px] tracking-[0.5em] uppercase font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Roma, dal 1962
                </motion.p>
                <motion.h1
                  className="text-white font-light tracking-tight leading-[0.95]"
                  style={{
                    fontSize: "clamp(2.8rem, 12vw, 6rem)",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    letterSpacing: "-0.01em",
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: [0.25, 0, 0, 1] }}
                >
                  Osteria Roma
                </motion.h1>
                <motion.div
                  className="w-8 h-[1px] bg-white/25"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  style={{ transformOrigin: "left" }}
                />
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 w-48">
                <div className="w-full h-[1px] bg-white/12 overflow-hidden">
                  <motion.div
                    className="h-full bg-white/50"
                    style={{ width: `${loadProgress * 100}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
                <motion.p
                  className="text-white/25 text-[9px] tracking-[0.4em] uppercase font-light tabular-nums"
                  animate={{ opacity: [0.25, 0.55, 0.25] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {Math.round(loadProgress * 100)}%
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas — frame sequence */}
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* "Osteria Roma" overlay — fades out on scroll via ref */}
        <AnimatePresence>
          {ready && (
            <motion.div
              ref={heroTextRef}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Subtle gradient at top to help text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 45%, transparent 55%, rgba(0,0,0,0.3) 100%)",
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <p className="text-white/40 text-[9px] tracking-[0.5em] uppercase font-light">
                  Roma, dal 1962
                </p>
                <h1
                  className="text-white font-light tracking-tight leading-[0.95] text-center"
                  style={{
                    fontSize: "clamp(2.8rem, 12vw, 6rem)",
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    letterSpacing: "-0.01em",
                    textShadow: "0 2px 24px rgba(0,0,0,0.5)",
                  }}
                >
                  Osteria Roma
                </h1>
                <div className="w-8 h-[1px] bg-white/30" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll hint */}
        <AnimatePresence>
          {ready && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <p className="text-white/35 text-[9px] tracking-[0.4em] uppercase">Scorri</p>
              <motion.div
                className="w-[1px] h-7 bg-white/20 origin-top"
                animate={{ scaleY: [0, 1, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
