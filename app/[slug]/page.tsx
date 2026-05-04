import { readdirSync } from "fs"
import { join } from "path"
import { notFound } from "next/navigation"
import { getRestaurant } from "@/lib/getRestaurant"
import { CinematicMenu } from "@/components/menu/CinematicMenu"

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
  const r = await getRestaurant(slug)
  if (!r) return {}
  return { title: r.restaurant }
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)
  if (!restaurant) notFound()

  return <CinematicMenu restaurant={restaurant} />
}
