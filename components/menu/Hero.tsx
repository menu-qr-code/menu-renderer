import type { RestaurantParams } from "@/lib/types"
import { HeroCinematic } from "./HeroCinematic"
import { HeroScrollVideo } from "./HeroScrollVideo"
import { HeroBoldTypography } from "./HeroBoldTypography"

export function Hero({ params }: { params: RestaurantParams }) {
  switch (params.hero_type) {
    case "scroll-video":
      return <HeroScrollVideo params={params} />
    case "bold-typography":
      return <HeroBoldTypography params={params} />
    case "cinematic-photo":
    case "parallax":
    case "3d-reveal":
    default:
      return <HeroCinematic params={params} />
  }
}
