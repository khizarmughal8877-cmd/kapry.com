import {FormEvent, useMemo, useState} from 'react';
import {
  ArrowRight,
  Check,
  Expand,
  Mail,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Star,
  X,
} from 'lucide-react';
import {
  ClothingSize,
  HERO_IMAGE,
  INITIAL_REVIEWS,
  PRODUCTS,
  Product,
  ProductCategory,
  Review,
  SIZES,
  getDiscountPercent,
} from './data/catalog';
import {ProductImage} from './components/ProductImage';
import {CartDrawer, CartItem} from './components/CartDrawer';
import {ZoomModal} from './components/ZoomModal';

type CategoryFilter =
  | 'All'
  | 'All Shirts'
  | 'Hoodies'
  | 'Lowers'
  | 'Baggy Shirts'
  | 'Clearance'
  | ProductCategory;

type SortOrder = 'featured' | 'price-asc' | 'price-desc';

const CATEGORIES: CategoryFilter[] = [
  'All',
  'All Shirts',
  'Hoodies',
  'Lowers',
  'Baggy Shirts',
  'Clearance',
  'Outerwear',
  'Footwear',
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');
  const [showPromoBar, setShowPromoBar] = useState(true);

  const [selectedSizes, setSelectedSizes] = useState<Record<string, ClothingSize>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 'M'])),
  );
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [zoomProduct, setZoomProduct] = useState<Product | null>(null);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const clearanceCount = useMemo(
    () => PRODUCTS.filter((p) => p.isClearance).length,
    [],
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === 'All'
          ? true
          : activeCategory === 'All Shirts'
            ? product.department === 'Shirts'
            : activeCategory === 'Hoodies'
              ? product.department === 'Hoodies'
              : activeCategory === 'Lowers'
                ? product.department === 'Lowers'
                : activeCategory === 'Clearance'
                  ? Boolean(product.isClearance)
                  : product.category === activeCategory;

      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.department.toLowerCase().includes(query) ||
        product.material.toLowerCase().includes(query) ||
        product.fit.toLowerCase().includes(query) ||
        (product.style?.toLowerCase().includes(query) ?? false) ||
        (product.tags?.some((tag) => tag.toLowerCase().includes(query)) ?? false);

      return matchesCategory && matchesQuery;
    });

    if (sortOrder === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortOrder === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [searchQuery, activeCategory, sortOrder]);

  const showSectionedOverview =
    activeCategory === 'All' &&
    searchQuery.trim() === '' &&
    sortOrder === 'featured';

  const departmentSections = useMemo(
    () => [
      {
        id: 'shirts-section',
        kicker: 'All Shirt Types',
        title: 'Shirts & Baggy Tees',
        filter: 'All Shirts' as CategoryFilter,
        items: PRODUCTS.filter((p) => p.department === 'Shirts'),
      },
      {
        id: 'hoodies-section',
        kicker: 'Zip · Baggy · Animated · Cartoon',
        title: 'Hoodies Collection',
        filter: 'Hoodies' as CategoryFilter,
        items: PRODUCTS.filter((p) => p.department === 'Hoodies'),
      },
      {
        id: 'lowers-section',
        kicker: 'Trousers · Cargo Pants · Jeans · Shorts',
        title: 'Lowers Collection',
        filter: 'Lowers' as CategoryFilter,
        items: PRODUCTS.filter((p) => p.department === 'Lowers'),
      },
      {
        id: 'essentials-section',
        kicker: 'Dresses · Outerwear · Footwear',
        title: 'More Essentials',
        filter: 'All' as CategoryFilter,
        items: PRODUCTS.filter((p) => p.department === 'Essentials'),
      },
    ],
    [],
  );

  const totalBagCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const jumpToCategory = (category: CategoryFilter) => {
    setActiveCategory(category);
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  const handleHeroSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  };

  const handleSizeChange = (productId: string, size: ClothingSize) => {
    setSelectedSizes((prev) => ({...prev, [productId]: size}));
  };

  const handleAddToCart = (product: Product, size: ClothingSize) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size,
      );
      if (existingIndex >= 0) {
        return prev.map((item, idx) =>
          idx === existingIndex ? {...item, quantity: item.quantity + 1} : item,
        );
      }
      return [...prev, {product, size, quantity: 1}];
    });
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1500);
  };

  const handleBuyNow = (product: Product) => {
    const size = selectedSizes[product.id] ?? 'M';
    handleAddToCart(product, size);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (
    productId: string,
    size: ClothingSize,
    delta: number,
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId && item.size === size
            ? {...item, quantity: item.quantity + delta}
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (productId: string, size: ClothingSize) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size)),
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) {
      setReviewError('Please enter both your name and your review.');
      setReviewSuccess(false);
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewText.trim(),
      date: 'Just now',
    };

    setReviews((prev) => [newReview, ...prev]);
    setReviewName('');
    setReviewRating(5);
    setReviewText('');
    setReviewError('');
    setReviewSuccess(true);
    window.setTimeout(() => setReviewSuccess(false), 3000);
  };

  const renderProductCard = (product: Product) => {
    const activeSize = selectedSizes[product.id] ?? 'M';
    const isJustAdded = recentlyAddedId === product.id;
    const discount = getDiscountPercent(product);

    return (
      <article
        key={product.id}
        className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
      >
        <button
          type="button"
          onClick={() => setZoomProduct(product)}
          className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 text-left cursor-zoom-in"
          aria-label={`Zoom preview of ${product.name}`}
        >
          <ProductImage
            src={product.image}
            alt={product.name}
            title={product.name}
            className="w-full h-full"
            imgClassName="transition-transform duration-300 group-hover:scale-103"
          />
          <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-stone-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
            <Expand className="w-3.5 h-3.5" />
          </span>
        </button>

        <div className="p-4 flex-1 flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500 font-medium truncate">
              {product.isClearance && discount > 0 ? (
                <span className="text-[#9a5b13] font-semibold">
                  Clearance · Save {discount}%
                </span>
              ) : (
                product.category
              )}{' '}
              · {product.fit}
            </p>

            <h3 className="mt-1 text-base font-semibold text-stone-900 truncate">
              {product.name}
            </h3>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[15px] font-semibold text-[#b77a15] tabular-nums whitespace-nowrap">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through tabular-nums whitespace-nowrap">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-stone-500 truncate">
              {product.material}
              {product.style ? ` · ${product.style}` : ''}
            </p>
          </div>

          <div className="space-y-2.5">
            <div>
              <span className="sr-only">Select size for {product.name}</span>
              <div
                className="grid grid-cols-5 gap-1.5"
                role="radiogroup"
                aria-label={`Size for ${product.name}`}
              >
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    role="radio"
                    aria-checked={activeSize === s.value}
                    onClick={() => handleSizeChange(product.id, s.value)}
                    className={`h-8 text-xs font-semibold rounded border transition-colors cursor-pointer whitespace-nowrap ${
                      activeSize === s.value
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {s.value}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleAddToCart(product, activeSize)}
                className={`inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isJustAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-900 text-white hover:bg-[#b77a15]'
                }`}
              >
                {isJustAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Added
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>

              <button
                type="button"
                onClick={() => handleBuyNow(product)}
                className="py-2.5 px-3 rounded-md border border-stone-300 bg-white text-stone-900 text-xs font-semibold hover:border-stone-900 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#141413]">
      {/* Slim Dismissible Clearance Announcement Bar (<= 40px) */}
      {showPromoBar && (
        <div className="bg-stone-900 text-stone-100 h-9 px-4 flex items-center justify-center relative text-xs">
          <button
            type="button"
            onClick={() => jumpToCategory('Clearance')}
            className="hover:text-[#f5bd50] transition-colors cursor-pointer truncate max-w-[85%] whitespace-nowrap"
          >
            Seasonal Clearance: Save up to 26% on {clearanceCount} selected shirts, hoodies & lowers — Shop Clearance
          </button>
          <button
            type="button"
            onClick={() => setShowPromoBar(false)}
            aria-label="Dismiss announcement"
            className="absolute right-3 p-1 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar: 3-zone contract */}
      <header className="sticky top-0 z-30 bg-[#faf9f6]/95 backdrop-blur-sm border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#home"
            className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
          >
            kapry.com
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600"
          >
            <button
              type="button"
              onClick={() => jumpToCategory('All Shirts')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Shirts
            </button>
            <button
              type="button"
              onClick={() => jumpToCategory('Hoodies')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Hoodies
            </button>
            <button
              type="button"
              onClick={() => jumpToCategory('Lowers')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Lowers
            </button>
            <button
              type="button"
              onClick={() => jumpToCategory('Clearance')}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Clearance
            </button>
            <a
              href="#reviews"
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 py-2 px-4 rounded-md bg-stone-900 text-white text-xs font-semibold hover:bg-[#b77a15] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="tabular-nums">Bag ({totalBagCount})</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Section 1: Editorial 2-Column Storefront Hero with Search */}
        <section id="home" className="max-w-7xl mx-auto px-6 pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch rounded-2xl overflow-hidden border border-stone-200/90 bg-white">
            <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between gap-7">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#9a5b13] font-semibold">
                  Shirts · Hoodies · Trousers, Pants & Shorts
                </p>
                <h1 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2.25rem,3.6vw,3.35rem)] leading-[1.08] font-semibold text-stone-900 text-balance">
                  Wear Your Style
                </h1>
                <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
                  Browse oversized baggy shirts, graphic & zip hoodies, and relaxed lowers crafted for everyday drape.
                </p>

                {/* Instant Storefront Search Bar */}
                <form
                  onSubmit={handleHeroSearchSubmit}
                  className="mt-6 flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search shirts, hoodies, trousers, shorts..."
                      aria-label="Search store catalog"
                      className="w-full pl-10 pr-3 py-2.5 text-sm rounded-md border border-stone-300 bg-stone-50 focus:bg-white focus:border-stone-900 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-md bg-stone-900 text-white text-sm font-semibold hover:bg-[#b77a15] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Search
                  </button>
                </form>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href="#collection"
                    onClick={() => setActiveCategory('All')}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-md bg-stone-900 text-white text-sm font-semibold hover:bg-[#b77a15] transition-colors whitespace-nowrap"
                  >
                    Explore All
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => jumpToCategory('Clearance')}
                    className="py-2.5 px-4 rounded-md border border-stone-300 text-stone-900 text-sm font-semibold hover:border-stone-900 hover:bg-stone-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Clearance ({clearanceCount})
                  </button>
                </div>
              </div>

              <div className="pt-5 border-t border-stone-200 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                <span>Cash on Delivery</span>
                <span aria-hidden="true">·</span>
                <span>Free Shipping Rs. 5,000+</span>
                <span aria-hidden="true">·</span>
                <span>7-Day Easy Exchange</span>
              </div>
            </div>

            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[460px] bg-stone-100">
              <ProductImage
                src={HERO_IMAGE}
                alt="kapry.com contemporary apparel lookbook"
                title="kapry.com Collection"
                className="w-full h-full lg:absolute lg:inset-0"
                imgClassName="lg:h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Featured Clothing Collection */}
        <section
          id="collection"
          className="max-w-7xl mx-auto px-6 py-12 border-t border-stone-200/80"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
                Curated Wardrobe · <span className="tabular-nums">{filteredProducts.length}</span> Pieces
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-stone-900">
                {activeCategory === 'All Shirts'
                  ? 'All Shirts & Tees'
                  : activeCategory === 'Hoodies'
                    ? 'Hoodies Section'
                    : activeCategory === 'Lowers'
                      ? 'Lowers — Trousers, Pants & Shorts'
                      : activeCategory === 'Clearance'
                        ? 'Clearance Markdowns'
                        : activeCategory === 'All'
                          ? 'Shop by Category'
                          : activeCategory}
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by name, style, or fit..."
                  aria-label="Filter collection"
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 text-sm rounded-md border border-stone-300 bg-white focus:border-stone-900 outline-none"
                />
              </div>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                aria-label="Sort products"
                className="py-2.5 px-3.5 text-sm rounded-md border border-stone-300 bg-white text-stone-700 focus:border-stone-900 outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg w-fit mb-10"
            role="tablist"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCategory === category
                    ? 'bg-white text-stone-900 shadow-xs'
                    : category === 'Clearance'
                      ? 'text-[#9a5b13] hover:text-stone-900'
                      : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {category === 'Clearance'
                  ? `Clearance (${clearanceCount})`
                  : category}
              </button>
            ))}
          </div>

          {/* Product Display: Sectioned View for All / Flat Grid for Filtered or Searched */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-stone-200">
              <p className="text-base font-semibold text-stone-900">
                No matching items found
              </p>
              <p className="text-sm text-stone-500 mt-1">
                Try clearing your search or switching category filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-4 py-2 px-4 rounded-md bg-stone-900 text-white text-xs font-semibold hover:bg-[#b77a15] transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : showSectionedOverview ? (
            <div className="space-y-14">
              {departmentSections.map((section) => (
                <div key={section.id} id={section.id} className="space-y-6">
                  <div className="flex items-end justify-between gap-4 border-b border-stone-200 pb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-stone-500 font-semibold">
                        {section.kicker}
                      </p>
                      <h3 className="mt-0.5 font-[family-name:var(--font-display)] text-2xl font-semibold text-stone-900">
                        {section.title}
                      </h3>
                    </div>

                    {section.filter !== 'All' && (
                      <button
                        type="button"
                        onClick={() => setActiveCategory(section.filter)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#b77a15] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        View all ({section.items.length})
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.items.map(renderProductCard)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(renderProductCard)}
            </div>
          )}
        </section>

        {/* Section 3: Customer Reviews & Contact */}
        <section
          id="reviews"
          className="max-w-7xl mx-auto px-6 py-14 border-t border-stone-200/80"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
                  Verified Feedback
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-stone-900">
                  Customer Reviews
                </h2>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-5 rounded-xl border border-stone-200/90 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                        <span className="text-sm font-semibold text-stone-900">
                          {rev.name}
                        </span>
                        {rev.verifiedItem && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{rev.verifiedItem}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span>{rev.date}</span>
                      </div>

                      <div
                        className="flex items-center gap-0.5 text-[#d99c35] shrink-0"
                        aria-label={`${rev.rating} out of 5 stars`}
                      >
                        {Array.from({length: 5}).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleReviewSubmit}
                className="bg-white p-6 rounded-xl border border-stone-200/90 space-y-4"
              >
                <h3 className="text-base font-semibold text-stone-900">
                  Write a Review
                </h3>
                {reviewError && (
                  <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {reviewError}
                  </p>
                )}
                {reviewSuccess && (
                  <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                    Thank you! Your review has been published above.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Your Name"
                    aria-label="Your Name"
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-stone-300 bg-white focus:border-stone-900 outline-none"
                  />
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    aria-label="Star Rating"
                    className="w-full px-3.5 py-2.5 text-sm rounded-md border border-stone-300 bg-white text-stone-800 focus:border-stone-900 outline-none cursor-pointer"
                  >
                    <option value={5}>5 Stars — Excellent</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Good</option>
                    <option value={2}>2 Stars — Fair</option>
                    <option value={1}>1 Star — Needs Improvement</option>
                  </select>
                </div>

                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts on fabric, sizing, and delivery..."
                  aria-label="Review comment"
                  className="w-full px-3.5 py-2.5 text-sm rounded-md border border-stone-300 bg-white focus:border-stone-900 outline-none resize-y"
                />

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-md bg-[#b77a15] text-white text-sm font-semibold hover:bg-[#96630f] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Submit Review
                </button>
              </form>
            </div>

            <div id="contact" className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500 font-semibold">
                  Visit or Reach Out
                </p>
                <h2 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold text-stone-900">
                  Contact kapry.com
                </h2>
              </div>

              <div className="bg-white p-6 rounded-xl border border-stone-200/90 space-y-5">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold text-stone-900">
                    kapry.com Clothing Store
                  </h3>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                    Oversized baggy shirts, zip & graphic hoodies, trousers, cargo pants & shorts, and seasonal clearance essentials with nationwide Cash on Delivery.
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-stone-200 text-sm text-stone-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#b77a15] shrink-0 mt-1" />
                    <span>Gulberg III, Main Boulevard, Lahore, Pakistan</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#b77a15] shrink-0" />
                    <span className="tabular-nums">+92 300 1234567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#b77a15] shrink-0" />
                    <span>support@kapry.com</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
                  <div className="text-xs text-stone-500">
                    <p className="font-semibold text-stone-800">Store Hours</p>
                    <p>Mon – Sat · 10:00 AM – 9:00 PM</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    className="py-2.5 px-4 rounded-md bg-stone-900 text-white text-xs font-semibold hover:bg-[#b77a15] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Open Bag ({totalBagCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-display)] text-xl font-bold text-[#f5bd50]">
            kapry.com
          </span>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
            <button
              type="button"
              onClick={() => jumpToCategory('All Shirts')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Shirts
            </button>
            <button
              type="button"
              onClick={() => jumpToCategory('Hoodies')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Hoodies
            </button>
            <button
              type="button"
              onClick={() => jumpToCategory('Lowers')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Lowers
            </button>
            <button
              type="button"
              onClick={() => jumpToCategory('Clearance')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Clearance
            </button>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-stone-400">
            © 2026 kapry.com. All rights reserved.
          </p>
        </div>
      </footer>

      <ZoomModal
        product={zoomProduct}
        initialSize={zoomProduct ? selectedSizes[zoomProduct.id] ?? 'M' : 'M'}
        onClose={() => setZoomProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
