"use client";

import React from "react";

interface ImageAutoSliderProps {
  images: string[];
  speed?: number;
}

export function ImageAutoSlider({ images, speed = 22 }: ImageAutoSliderProps) {
  const duplicated = [...images, ...images];

  return (
    <>
      <style>{`
        @keyframes osteria-scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .osteria-infinite-scroll {
          animation: osteria-scroll-right ${speed}s linear infinite;
        }
        .osteria-scroll-mask {
          mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
        .osteria-img-item {
          transition: transform 0.3s ease, filter 0.3s ease;
        }
        .osteria-img-item:hover {
          transform: scale(1.04);
          filter: brightness(1.08);
        }
      `}</style>

      <div
        className="w-full overflow-hidden py-8"
        style={{ background: "#120D08" }}
      >
        <div className="osteria-scroll-mask w-full">
          <div className="osteria-infinite-scroll flex gap-5 w-max">
            {duplicated.map((src, i) => (
              <div
                key={i}
                className="osteria-img-item flex-shrink-0 rounded-xl overflow-hidden shadow-2xl"
                style={{ width: "260px", height: "195px" }}
              >
                <img
                  src={src}
                  alt={`Gallery ${(i % images.length) + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
