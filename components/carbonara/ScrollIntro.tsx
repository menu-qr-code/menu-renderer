"use client"

import { useEffect, useRef, useState } from "react"

const FRAME_COUNT = 121
const framePath = (i: number) =>
  `/frames/carbonara/frame_${String(i + 1).padStart(4, "0")}.jpg`

export default function ScrollIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const tickingRef = useRef(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [ready, setReady] = useState(false)

  // Resize canvas once — on mount and window resize
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

    // cover-fit
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

  // Preload all frames
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

  // Scroll handler
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
        {!ready && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black gap-4">
            <p className="text-zinc-500 text-sm tracking-widest uppercase">
              Loading
            </p>
            <div className="w-48 h-[2px] bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-75"
                style={{ width: `${loadProgress * 100}%` }}
              />
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </section>
  )
}
