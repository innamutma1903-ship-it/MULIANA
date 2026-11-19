import { useState } from 'react';
import { Footprints } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  brand?: string;
  className?: string;
}

export function ProductImage({ src, alt, brand, className = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-zinc-100 text-zinc-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Footprints className="w-8 h-8 mb-2 text-zinc-400" strokeWidth={1.5} />
        {brand && <span className="text-xs font-medium tracking-wide text-zinc-400">{brand}</span>}
        <span className="text-sm font-medium text-zinc-700 mt-0.5 line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
