"use client"

import { useEffect, useState } from "react"

interface Props {
  restaurantName: string
  accentColor: string
  bgColor: string
  textColor: string
  mutedColor: string
}

export function LoyaltyPopupClient({ restaurantName, accentColor, bgColor, textColor, mutedColor }: Props) {
  const [visible, setVisible] = useState(false)
  const [phone, setPhone] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30000)
    return () => clearTimeout(t)
  }, [])

  if (!visible || sent) return null

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: bgColor,
      borderTop: `1px solid rgba(201,168,76,0.25)`,
      padding: "24px",
    }}>
      <button
        onClick={() => setVisible(false)}
        style={{ position: "absolute", top: 16, right: 20, color: mutedColor, background: "none", border: "none", cursor: "pointer", fontSize: 16 }}
      >✕</button>

      <p style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: accentColor, marginBottom: 8 }}>
        {restaurantName} — offerta riservata
      </p>
      <p style={{ fontSize: 16, fontFamily: "var(--font-serif), serif", color: textColor, marginBottom: 4 }}>
        Lascia il numero.
      </p>
      <p style={{ fontSize: 16, fontFamily: "var(--font-serif), serif", color: textColor, marginBottom: 16 }}>
        Sul conto, meno 10%.
      </p>

      <form onSubmit={e => { e.preventDefault(); setSent(true) }} style={{ display: "flex", gap: 8 }}>
        <input
          type="tel"
          placeholder="+39 333 000 0000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          style={{
            flex: 1, padding: "12px 16px",
            background: "transparent",
            border: `1px solid ${mutedColor}`,
            color: textColor,
            fontFamily: "var(--font-grotesk), sans-serif",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            background: accentColor,
            color: bgColor,
            border: "none",
            fontFamily: "var(--font-grotesk), sans-serif",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Voglio il 10%
        </button>
      </form>
    </div>
  )
}
