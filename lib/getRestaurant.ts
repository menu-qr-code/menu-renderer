import type { RestaurantParams } from "./types"

// Per ora legge da file locali. In produzione: query Supabase.
export async function getRestaurant(slug: string): Promise<RestaurantParams | null> {
  try {
    const data = await import(`../data/restaurants/${slug}.json`)
    return data.default as RestaurantParams
  } catch {
    return null
  }
}
