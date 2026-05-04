import type { Metadata } from "next"
import { Noto_Serif, Space_Grotesk } from "next/font/google"
import "./globals.css"

const notoSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Menu",
  description: "Menu digitale",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${notoSerif.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  )
}
