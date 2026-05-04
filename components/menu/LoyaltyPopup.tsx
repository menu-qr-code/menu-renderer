"use client"

import { useEffect, useState } from "react"
import type { RestaurantParams } from "@/lib/types"

export function LoyaltyPopup({ params }: { params: RestaurantParams }) {
  const [visible, setVisible] = useState(false)
  const [phone, setPhone] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible || sent) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: POST /api/contacts con { slug, phone }
    setSent(true)
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-6"
      style={{ background: "var(--color-bg2)", borderTop: "var(--divider) solid 1px" }}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-4 right-6 text-xs"
        style={{ color: "var(--color-muted)" }}
      >
        ✕
      </button>

      <p
        className="text-xs uppercase tracking-widest mb-3"
        style={{ color: "var(--color-accent)", letterSpacing: "0.25em" }}
      >
        {params.restaurant}
      </p>
      <p
        className="text-sm mb-4"
        style={{ color: "var(--color-text)", lineHeight: 1.5 }}
      >
        Vuoi sapere prima degli altri quando esce qualcosa di nuovo?
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="tel"
          placeholder="+39 333 000 0000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="flex-1 px-4 py-3 text-sm bg-transparent outline-none"
          style={{
            border: "1px solid var(--color-muted)",
            color: "var(--color-text)",
            borderRadius: "var(--radius)",
          }}
        />
        <button
          type="submit"
          className="px-5 py-3 text-xs uppercase font-semibold tracking-wider"
          style={{
            background: "var(--color-accent)",
            color: "var(--color-bg)",
            borderRadius: "var(--radius)",
          }}
        >
          Entra
        </button>
      </form>
    </div>
  )
}
