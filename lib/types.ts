export type EmotionalTone = "warm" | "cold" | "energetic" | "calm" | "mysterious"
export type HeroType = "scroll-video" | "cinematic-photo" | "bold-typography" | "parallax" | "3d-reveal"
export type InteractionMode = "linear" | "exploratory" | "immersive" | "fast" | "narrative"
export type ColorTemperature = "warm" | "cool" | "neutral" | "high-contrast" | "cold-dark"
export type RichnessSource = "content-video" | "content-photos" | "content-photos-casual" | "ui-color" | "typography" | "mixed"
export type ComplexityLevel = "simple" | "medium" | "complex"

export interface Typography {
  display: string
  cocktail_name?: string
  dish_name?: string
  ingredients: string
  price: string
  meta_labels: string
}

export interface RestaurantParams {
  restaurant: string
  type: string
  city: string

  emotional_tone: EmotionalTone
  motion_intensity: number       // 1-10
  layout_density: number         // 1-10
  hero_type: HeroType
  interaction_mode: InteractionMode

  color_temperature: ColorTemperature
  ui_color_intensity: number     // 1-10
  richness_source: RichnessSource
  richness_note: string

  primary_palette: string[]
  text_color: string
  accent_color: string
  description_color: string

  typography: Typography

  border_radius: string
  dividers: string

  has_video: boolean
  video_integration?: string

  complexity_level: ComplexityLevel

  special_elements?: Record<string, unknown>
}
