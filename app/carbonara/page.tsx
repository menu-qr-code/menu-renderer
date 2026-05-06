import ScrollIntro from "@/components/carbonara/ScrollIntro"

export default function CarbonaraPage() {
  return (
    <main className="bg-black">
      <ScrollIntro />
      <section className="h-screen flex items-center justify-center bg-black">
        <p className="text-zinc-500 text-sm tracking-widest uppercase">
          — Menu —
        </p>
      </section>
    </main>
  )
}
