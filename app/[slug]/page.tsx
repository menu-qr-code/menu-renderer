import { readdirSync } from "fs"
import { join } from "path"
import { notFound } from "next/navigation"
import { getRestaurant } from "@/lib/getRestaurant"
import { buildCssVars } from "@/lib/buildTheme"
import { Hero } from "@/components/menu/Hero"
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
  const rootStyle = Object.entries(cssVars)
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ")

  return (
    <main
      style={{
        ...Object.fromEntries(Object.entries(cssVars)),
        background: "var(--color-bg)",
        color: "var(--color-text)",
        minHeight: "100svh",
      }}
    >
      <Hero params={restaurant} />

      <section
        className="px-6"
        style={{ paddingTop: "var(--section-pad)", paddingBottom: "var(--section-pad)" }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-8"
          style={{ color: "var(--color-accent)", letterSpacing: "0.3em" }}
        >
          Menu
        </p>

        <p
          className="text-sm"
          style={{ color: "var(--color-muted)", lineHeight: 1.7, maxWidth: "32ch" }}
        >
          I piatti arriveranno qui — caricali dalla tua dashboard.
        </p>
      </section>

      <LoyaltyPopup params={restaurant} />
    </main>
  )
}
