import {useState} from 'react';
import {Shirt} from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
  imgClassName?: string;
}

export function ProductImage({
  src,
  alt,
  title,
  className = '',
  imgClassName = '',
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-stone-200/70 to-amber-50/60 text-stone-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Shirt className="w-9 h-9 text-stone-400 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium text-stone-600 line-clamp-2">
          {title || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-stone-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
