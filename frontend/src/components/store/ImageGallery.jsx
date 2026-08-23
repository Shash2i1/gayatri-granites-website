import { useState } from 'react';

export default function ImageGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-background rounded-lg flex items-center justify-center text-muted text-sm">
        No image available
      </div>
    );
  }

  const active = images[activeIndex];

  return (
    <div>
      <div className="aspect-square bg-background rounded-lg overflow-hidden">
        <img src={active.imageUrl} alt={productName} className="w-full h-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`w-16 h-16 shrink-0 rounded-md overflow-hidden border-2 ${
                i === activeIndex ? 'border-accent' : 'border-transparent'
              }`}
            >
              <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}