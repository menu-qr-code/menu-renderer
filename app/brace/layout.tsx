import type { Metadata } from "next";
import { Barlow_Condensed } from "next/font/google";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BRACE — Braceria Contemporanea · Milano, Navigli",
  description: "Fuoco, carbone, materia. La costata matura 60 giorni. Via Corsico 4, Milano.",
};

export default function BraceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={barlow.variable} style={{ fontFamily: "var(--font-barlow), sans-serif" }}>
      {children}
    </div>
  );
}
