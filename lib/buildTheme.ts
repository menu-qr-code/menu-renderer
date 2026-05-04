import type { RestaurantParams } from "./types"

// Converts restaurant params → CSS custom properties injected on :root
export function buildCssVars(p: RestaurantParams): Record<string, string> {
  const [bg1, bg2 = bg1, bg3 = bg2] = p.primary_palette

  // Motion: 1-10 → animation duration in ms (fast = short duration)
  const motionMs = Math.round(2200 - p.motion_intensity * 180)

  // Layout density: 1-10 → vertical padding scale
  const densityPad = Math.round(120 - p.layout_density * 10)

  // Border radius: extract px value from the string, default 0
  const radiusMatch = p.border_radius.match(/(\d+)px/)
  const radius = radiusMatch ? radiusMatch[1] + "px" : "0px"

  return {
    "--color-bg":       bg1,
    "--color-bg2":      bg2,
    "--color-bg3":      bg3,
    "--color-text":     p.text_color,
    "--color-accent":   p.accent_color,
    "--color-muted":    p.description_color,
    "--radius":         radius,
    "--motion-ms":      motionMs + "ms",
    "--section-pad":    densityPad + "px",
    "--divider":        p.dividers,
  }
}

// Returns inline style string for the root element
export function buildRootStyle(p: RestaurantParams): string {
  return Object.entries(buildCssVars(p))
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ")
}
