import {useEffect, useState} from 'react';
import {X, ShoppingBag} from 'lucide-react';
import {ClothingSize, Product, SIZES, getDiscountPercent} from '../data/catalog';
import {ProductImage} from './ProductImage';

interface ZoomModalProps {
  product: Product | null;
  initialSize: ClothingSize;
  onClose: () => void;
  onAddToCart: (product: Product, size: ClothingSize) => void;
}

export function ZoomModal({
  product,
  initialSize,
  onClose,
  onAddToCart,
}: ZoomModalProps) {
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(initialSize);

  useEffect(() => {
    setSelectedSize(initialSize);
  }, [initialSize, product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const discount = getDiscountPercent(product);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} preview`}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-[4/3] md:aspect-auto md:h-full bg-stone-100">
          <ProductImage
            src={product.image}
            alt={product.name}
            title={product.name}
            className="w-full h-full"
          />
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-medium">
              {product.isClearance && discount > 0 ? (
                <span className="text-[#9a5b13] font-semibold">
                  Clearance · Save {discount}%
                </span>
              ) : (
                product.category
              )}{' '}
              · {product.fit}
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-stone-900">
              {product.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="text-xl font-semibold text-[#b77a15] tabular-nums">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through tabular-nums">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="mt-4 text-sm text-stone-600 leading-relaxed">
              Crafted from {product.material}. Tailored for everyday comfort with reinforced seams and breathable finish.
            </p>
            {(product.style || (product.tags && product.tags.length > 0)) && (
              <p className="mt-2.5 text-xs text-stone-500">
                {[product.style, ...(product.tags ?? [])]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}

            <div className="mt-6">
              <label
                htmlFor="modal-size-select"
                className="block text-xs font-semibold text-stone-700 mb-2"
              >
                Select Size
              </label>
              <div
                id="modal-size-select"
                className="grid grid-cols-5 gap-2"
                role="radiogroup"
                aria-label="Choose size"
              >
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSelectedSize(s.value)}
                    className={`py-2.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                      selectedSize === s.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                onAddToCart(product, selectedSize);
                onClose();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-md bg-stone-900 text-white text-sm font-semibold hover:bg-[#b77a15] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
