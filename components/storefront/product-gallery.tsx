"use client";

import { useState } from "react";

type GalleryImage = { id: number; url: string | null; isPrimary: boolean };

export function ProductGallery({ images, productName }: { images: GalleryImage[]; productName: string }) {
  const usableImages = images.filter((image) => image.url);
  const [selected, setSelected] = useState(0);
  const activeImage = usableImages[selected]?.url;

  return (
    <div className="flex gap-3">
      {usableImages.length > 1 && (
        <div className="flex flex-col gap-2 w-16 md:w-20 shrink-0">
          {usableImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelected(index)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition ${
                selected === index ? "border-gold" : "border-border opacity-50 hover:opacity-100"
              }`}
            >
              <img src={image.url!} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-bg-card border border-border">
        {activeImage ? (
          <img src={activeImage} alt={productName} className="w-full aspect-square object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center aspect-square bg-bg-light">
            <span className="text-8xl text-gold/20 font-display">ب</span>
          </div>
        )}
      </div>
    </div>
  );
}
