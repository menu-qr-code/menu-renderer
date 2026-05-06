"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  src: string;
  alt?: string;
}

interface KineticScrollGalleryProps {
  images: GalleryImage[];
  className?: string;
}

interface ScrollContextValue {
  scrollYProgress: MotionValue<number>;
}

const ScrollContext = React.createContext<ScrollContextValue | undefined>(undefined);

function useScrollContext() {
  const ctx = React.useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollContext must be used within KineticScrollGallery");
  return ctx;
}

function GalleryCol({
  images,
  yRange = ["0%", "-10%"],
  className,
}: {
  images: GalleryImage[];
  yRange?: string[];
  className?: string;
}) {
  const { scrollYProgress } = useScrollContext();
  const y = useTransform(scrollYProgress, [0.5, 1], yRange);

  return (
    <motion.div
      className={cn("flex flex-col gap-2 w-full", className)}
      style={{ y }}
    >
      {images.map((img, i) => (
        <div key={i} className="relative overflow-hidden rounded-xl">
          <img
            src={img.src}
            alt={img.alt ?? "Panarea gallery"}
            className="w-full h-40 object-cover"
            style={{ display: "block" }}
          />
        </div>
      ))}
    </motion.div>
  );
}

export function KineticScrollGallery({ images, className }: KineticScrollGalleryProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1.15, 1]);

  const col1 = images.filter((_, i) => i % 3 === 0);
  const col2 = images.filter((_, i) => i % 3 === 1);
  const col3 = images.filter((_, i) => i % 3 === 2);

  return (
    <ScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative", className)}
        style={{ height: "350vh" }}
      >
        <div
          className="sticky top-0 overflow-hidden"
          style={{ height: "100vh" }}
        >
          <motion.div
            className="grid grid-cols-3 gap-3 h-full p-4"
            style={{
              rotateX,
              scale,
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            <GalleryCol images={col1} yRange={["-8%", "2%"]} />
            <GalleryCol images={col2} yRange={["15%", "5%"]} className="-mt-[40%]" />
            <GalleryCol images={col3} yRange={["-8%", "2%"]} />
          </motion.div>
        </div>
      </div>
    </ScrollContext.Provider>
  );
}
