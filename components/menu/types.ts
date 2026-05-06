export interface DishItem {
  name: string
  description: string
  price: number
  photo: string
}

export interface MenuSection {
  id: string
  title: string
  items: DishItem[]
}

export interface Palette {
  bg: string
  surface: string
  text: string
  muted: string
  accent: string
  divider: string
}

export interface RestaurantData {
  restaurant: string
  tagline: string
  type: string
  city: string
  hero_image: string
  hero_images?: string[]
  richness_source?: string
  palette: Palette
  fonts: {
    display: string
    body: string
  }
  sections: MenuSection[]
}
