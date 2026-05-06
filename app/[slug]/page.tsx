import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import { notFound } from "next/navigation"
import { MenuClient } from "@/components/menu/MenuClient"
import type { RestaurantData } from "@/components/menu/types"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const dir = join(process.cwd(), "data", "restaurants")
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"))
  return files.map((f) => ({ slug: f.replace(".json", "") }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const data: RestaurantData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "restaurants", `${slug}.json`), "utf-8")
    )
    return { title: `${data.restaurant} — Menu` }
  } catch {
    return {}
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  try {
    const data: RestaurantData = JSON.parse(
      readFileSync(join(process.cwd(), "data", "restaurants", `${slug}.json`), "utf-8")
    )
    return <MenuClient data={data} />
  } catch {
    notFound()
  }
}
