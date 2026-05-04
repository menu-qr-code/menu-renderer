import type { MenuItem } from "@/lib/types"

interface Props {
  items: MenuItem[]
  accentColor: string
  textColor: string
  mutedColor: string
}

export function MenuList({ items, accentColor, textColor, mutedColor }: Props) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i}>
          <div
            style={{
              borderTop: "1px rgba(201,168,76,0.15) solid",
              padding: "24px 0",
            }}
          >
            {item.mystery ? (
              <MysteryItem item={item} accentColor={accentColor} mutedColor={mutedColor} />
            ) : (
              <RegularItem item={item} accentColor={accentColor} textColor={textColor} mutedColor={mutedColor} />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function RegularItem({ item, accentColor, textColor, mutedColor }: {
  item: MenuItem
  accentColor: string
  textColor: string
  mutedColor: string
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <h3 style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: "20px",
          fontWeight: 400,
          letterSpacing: "0.04em",
          color: textColor,
        }}>
          {item.name}
        </h3>
        <span style={{
          fontFamily: "var(--font-grotesk), sans-serif",
          fontSize: "14px",
          color: accentColor,
          letterSpacing: "0.05em",
          flexShrink: 0,
          marginLeft: 16,
        }}>
          €{item.price}
        </span>
      </div>

      {item.ingredients && (
        <p style={{
          fontFamily: "var(--font-grotesk), sans-serif",
          fontSize: "11px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: mutedColor,
          lineHeight: 1.7,
          marginBottom: item.note ? 8 : 0,
        }}>
          {item.ingredients}
        </p>
      )}

      {item.note && (
        <p style={{
          fontFamily: "var(--font-grotesk), sans-serif",
          fontSize: "12px",
          fontStyle: "italic",
          color: mutedColor,
          opacity: 0.7,
        }}>
          {item.note}
        </p>
      )}
    </>
  )
}

function MysteryItem({ item, accentColor, mutedColor }: {
  item: MenuItem
  accentColor: string
  mutedColor: string
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 40,
          height: 40,
          background: "#131313",
          border: `1px solid ${accentColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ color: accentColor, fontSize: "18px" }}>?</span>
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "20px",
            fontWeight: 400,
            letterSpacing: "0.04em",
            color: accentColor,
          }}>
            {item.name}
          </h3>
          <p style={{
            fontFamily: "var(--font-grotesk), sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: mutedColor,
            marginTop: 4,
          }}>
            Ricetta segreta
          </p>
        </div>
      </div>
      <span style={{
        fontFamily: "var(--font-grotesk), sans-serif",
        fontSize: "14px",
        color: accentColor,
      }}>
        €{item.price}
      </span>
    </div>
  )
}
