"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

interface TextScrambleProps {
  text: string
  className?: string
  style?: React.CSSProperties
  autoPlay?: boolean
}

export function TextScramble({ text, className = "", style, autoPlay = false }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scramble = useCallback(() => {
    setIsScrambling(true)
    frameRef.current = 0
    const duration = text.length * 3
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      frameRef.current++
      const progress = frameRef.current / duration
      const revealedLength = Math.floor(progress * text.length)
      const newText = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " "
          if (i < revealedLength) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")
      setDisplayText(newText)
      if (frameRef.current >= duration) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayText(text)
        setIsScrambling(false)
      }
    }, 30)
  }, [text])

  useEffect(() => {
    if (!autoPlay) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { scramble(); observer.disconnect() } },
      { threshold: 0.3 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [autoPlay, scramble])

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  return (
    <div
      ref={containerRef}
      className={`group relative inline-flex flex-col cursor-default select-none ${className}`}
      style={style}
      onMouseEnter={() => { setIsHovering(true); scramble() }}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className="relative font-mono tracking-widest uppercase">
        {displayText.split("").map((char, i) => (
          <span
            key={i}
            className={`inline-block transition-all duration-150 ${
              isScrambling && char !== text[i] ? "opacity-40" : "opacity-100"
            }`}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="relative h-px w-full mt-2 overflow-hidden">
        <span
          className={`absolute inset-0 transition-transform duration-500 ease-out origin-left ${
            isHovering ? "scale-x-100" : "scale-x-0"
          }`}
          style={{ background: "#c8a97e" }}
        />
        <span className="absolute inset-0" style={{ background: "rgba(122,98,72,0.3)" }} />
      </span>
    </div>
  )
}
