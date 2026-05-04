import { readdirSync } from "fs"
import { join } from "path"
import { notFound } from "next/navigation"
import { getRestaurant } from "@/lib/getRestaurant"
import { buildCssVars } from "@/lib/buildTheme"
import { Hero } from "@/components/menu/Hero"
import { MenuList } from "@/components/menu/MenuList"
import { LoyaltyPopup } from "@/components/menu/LoyaltyPopup"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const dir = join(process.cwd(), "data", "restaurants")
  const files = readdirSync(dir).filter(f => f.endsWith(".json"))
  return files.map(f => ({ slug: f.replace(".json", "") }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)
  if (!restaurant) return {}
  return {
    title: restaurant.restaurant,
    description: `${restaurant.type} — ${restaurant.city}`,
  }
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)
  if (!restaurant) notFound()

  const cssVars = buildCssVars(restaurant)
  const cssVarsStyle = cssVars as React.CSSProperties

  return (
    <main style={{ ...cssVarsStyle, minHeight: "100svh" }}>
      <Hero params={restaurant} />

      <section style={{ padding: "64px 24px 80px" }}>
        <p style={{
          fontFamily: "var(--font-grotesk), sans-serif",
          fontSize: "10px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--color-accent)",
          marginBottom: "40px",
        }}>
          {restaurant.type} — {restaurant.city}
        </p>

        {restaurant.menu_items && restaurant.menu_items.length > 0 ? (
          <MenuList
            items={restaurant.menu_items}
            accentColor={restaurant.accent_color}
            textColor={restaurant.text_color}
            mutedColor={restaurant.description_color}
          />
        ) : (
          <p style={{
            fontFamily: "var(--font-grotesk), sans-serif",
            fontSize: "13px",
            color: "var(--color-muted)",
            lineHeight: 1.7,
          }}>
            Menu in aggiornamento.
          </p>
        )}
      </section>

      <LoyaltyPopup params={restaurant} />
    </main>
  )
}
