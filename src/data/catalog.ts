export type ProductCategory =
  | 'Men'
  | 'Women'
  | 'Baggy Shirts'
  | 'Hoodies'
  | 'Lowers'
  | 'Outerwear'
  | 'Footwear';

export type ProductDepartment = 'Shirts' | 'Hoodies' | 'Lowers' | 'Essentials';

export type ClothingSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  department: ProductDepartment;
  price: number;
  originalPrice?: number;
  isClearance?: boolean;
  image: string;
  material: string;
  fit: string;
  style?: string;
  tags?: string[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verifiedItem?: string;
}

export const SIZES: {value: ClothingSize; label: string}[] = [
  {value: 'S', label: 'Small (S)'},
  {value: 'M', label: 'Medium (M)'},
  {value: 'L', label: 'Large (L)'},
  {value: 'XL', label: 'XL'},
  {value: 'XXL', label: 'XXL'},
];

export const HERO_IMAGE = '/src/assets/images/hero_kapry_collection_1795274006559.jpg';

export const PRODUCTS: Product[] = [
  // --- SHIRTS (All Shirt Types: Baggy Tees, Baggy Shirts, Oxford Shirts, Crew Tees, Tops) ---
  {
    id: 'baggy-tee',
    name: 'Baggy Tee',
    category: 'Baggy Shirts',
    department: 'Shirts',
    price: 1450,
    image: '/src/assets/images/product_baggy_tee_1795274577726.jpg',
    material: '280gsm Sun-Washed Combed Cotton',
    fit: 'Oversized Drop-Shoulder Fit',
    style: 'Boxy Streetwear Tee',
    tags: ['shirt', 'baggy', 'oversized', 'tee', 't-shirt', 'streetwear', 'taupe'],
  },
  {
    id: 'baggy-striped-shirt',
    name: 'Oversized Striped Baggy Shirt',
    category: 'Baggy Shirts',
    department: 'Shirts',
    price: 2100,
    image: '/src/assets/images/product_baggy_shirt_striped_1795274399771.jpg',
    material: '230gsm Brushed Striped Cotton',
    fit: 'Drop-Shoulder Baggy Fit',
    style: 'Striped Boxy Shirt',
    tags: ['shirt', 'baggy', 'striped', 'oversized'],
  },
  {
    id: 'baggy-camp-shirt',
    name: 'Baggy Boxy Camp Shirt',
    category: 'Baggy Shirts',
    department: 'Shirts',
    price: 1650,
    originalPrice: 2150,
    isClearance: true,
    image: '/src/assets/images/product_baggy_shirt_camp_1795274400545.jpg',
    material: 'Heavyweight Olive Cotton Twill',
    fit: 'Wide Boxy Silhouette',
    style: 'Cuban Collar Shirt',
    tags: ['shirt', 'baggy', 'camp shirt', 'clearance', 'olive'],
  },
  {
    id: 'mens-casual-shirt',
    name: "Men's Casual Oxford Shirt",
    category: 'Men',
    department: 'Shirts',
    price: 1350,
    originalPrice: 1800,
    isClearance: true,
    image: '/src/assets/images/product_casual_shirt_1795274010704.jpg',
    material: '100% Brushed Oxford Cotton',
    fit: 'Tailored Regular Fit',
    style: 'Button-Down Shirt',
    tags: ['shirt', 'oxford', 'casual', 'clearance', 'men'],
  },
  {
    id: 'mens-tshirt',
    name: "Men's Heavyweight T-Shirt",
    category: 'Men',
    department: 'Shirts',
    price: 890,
    originalPrice: 1200,
    isClearance: true,
    image: '/src/assets/images/product_mens_tshirt_1795274010260.jpg',
    material: '240gsm Combed Jersey',
    fit: 'Relaxed Crew Neck',
    style: 'Everyday Crew Tee',
    tags: ['shirt', 't-shirt', 'tee', 'clearance', 'men'],
  },
  {
    id: 'womens-top',
    name: "Women's Pleated Poplin Top",
    category: 'Women',
    department: 'Shirts',
    price: 1190,
    originalPrice: 1600,
    isClearance: true,
    image: '/src/assets/images/product_womens_top_1795274010648.jpg',
    material: 'Crisp Cotton Poplin',
    fit: 'Pleated Mandarin Collar',
    style: 'Pleated Blouse Shirt',
    tags: ['shirt', 'top', 'blouse', 'clearance', 'women'],
  },

  // --- HOODIES (All Hoodie Styles: Graphic Zip, Zip-Up, Baggy, Animated, Cartoon, Classic) ---
  {
    id: 'graphic-zip-hoodie',
    name: 'Graphic Zip Hoodie',
    category: 'Hoodies',
    department: 'Hoodies',
    price: 3450,
    image: '/src/assets/images/product_graphic_zip_hoodie_1795274578057.jpg',
    material: '420gsm Washed Charcoal Fleece',
    fit: 'Relaxed Full-Zip Silhouette',
    style: 'Screen-Print Zip-Up',
    tags: ['zip hoodie', 'graphic', 'hoodie', 'streetwear', 'charcoal'],
  },
  {
    id: 'zip-hoodie',
    name: 'Heavyweight Zip-Up Hoodie',
    category: 'Hoodies',
    department: 'Hoodies',
    price: 3200,
    image: '/src/assets/images/product_zip_hoodie_1795274401393.jpg',
    material: '420gsm Espresso Fleece · Two-Way Zip',
    fit: 'Relaxed Layering Cut',
    style: 'Minimalist Zip Hoodie',
    tags: ['zip hoodie', 'hoodie', 'fleece', 'espresso'],
  },
  {
    id: 'baggy-hoodie',
    name: 'Oversized Baggy Hoodie',
    category: 'Hoodies',
    department: 'Hoodies',
    price: 3100,
    image: '/src/assets/images/product_baggy_hoodie_1795274402638.jpg',
    material: '400gsm Washed Mineral Fleece',
    fit: 'Ultra-Baggy Drop Shoulder',
    style: 'Washed Pullover Hoodie',
    tags: ['baggy hoodie', 'oversized', 'hoodie', 'slate'],
  },
  {
    id: 'animated-hoodie',
    name: 'Animated Line-Art Hoodie',
    category: 'Hoodies',
    department: 'Hoodies',
    price: 3400,
    image: '/src/assets/images/product_animated_hoodie_1795274402321.jpg',
    material: '400gsm Charcoal Cotton Fleece',
    fit: 'Boxy Streetwear Cut',
    style: 'Anime Graphic Pullover',
    tags: ['animated hoodie', 'anime', 'graphic', 'hoodie'],
  },
  {
    id: 'cartoon-hoodie',
    name: 'Retro Cartoon Graphic Hoodie',
    category: 'Hoodies',
    department: 'Hoodies',
    price: 2490,
    originalPrice: 3100,
    isClearance: true,
    image: '/src/assets/images/product_cartoon_hoodie_1795274403458.jpg',
    material: '380gsm Warm Cream Heavy Fleece',
    fit: 'Relaxed Graphic Fit',
    style: 'Vintage Cartoon Pullover',
    tags: ['cartoon hoodie', 'retro', 'clearance', 'hoodie'],
  },
  {
    id: 'fleece-hoodie',
    name: 'Classic Loopback Hoodie',
    category: 'Hoodies',
    department: 'Hoodies',
    price: 2800,
    image: '/src/assets/images/product_heavyweight_hoodie_1795274010790.jpg',
    material: '380gsm Oatmeal Loopback Fleece',
    fit: 'Structured Boxy Fit',
    style: 'Essential Fleece Hoodie',
    tags: ['hoodie', 'fleece', 'classic', 'oatmeal'],
  },

  // --- LOWERS (Trousers, Cargo Pants, Jeans, Shorts) ---
  {
    id: 'tailored-trousers',
    name: 'Pleated Tailored Trousers',
    category: 'Lowers',
    department: 'Lowers',
    price: 2650,
    image: '/src/assets/images/product_tailored_trousers_1795274857673.jpg',
    material: 'Twill Wool-Cotton Blend',
    fit: 'Wide-Leg Pleated Cut',
    style: 'Relaxed Dress Trouser',
    tags: ['lower', 'trouser', 'trousers', 'pants', 'pleated', 'wide leg'],
  },
  {
    id: 'cargo-pants',
    name: 'Utility Cargo Pants',
    category: 'Lowers',
    department: 'Lowers',
    price: 2450,
    image: '/src/assets/images/product_cargo_pants_1795274859315.jpg',
    material: '260gsm Cotton Ripstop',
    fit: 'Baggy Drawstring Hem',
    style: 'Streetwear Cargo Pant',
    tags: ['lower', 'pants', 'cargo', 'baggy pants', 'trouser'],
  },
  {
    id: 'selvedge-jeans',
    name: 'Indigo Selvedge Jeans',
    category: 'Lowers',
    department: 'Lowers',
    price: 1690,
    originalPrice: 2200,
    isClearance: true,
    image: '/src/assets/images/product_denim_jeans_1795274011242.jpg',
    material: '12.5oz Indigo Denim',
    fit: 'Slim Straight Cut',
    style: 'Selvedge Denim Pant',
    tags: ['lower', 'jeans', 'pants', 'denim', 'clearance'],
  },
  {
    id: 'cotton-shorts',
    name: 'Everyday Cotton Shorts',
    category: 'Lowers',
    department: 'Lowers',
    price: 1250,
    originalPrice: 1550,
    isClearance: true,
    image: '/src/assets/images/product_cotton_shorts_1795274858616.jpg',
    material: '300gsm Heavy Brushed Twill',
    fit: 'Above-Knee Relaxed Fit',
    style: 'Drawstring Chino Shorts',
    tags: ['lower', 'shorts', 'cotton shorts', 'clearance', 'summer'],
  },

  // --- DRESSES, OUTERWEAR & FOOTWEAR ---
  {
    id: 'womens-dress',
    name: "Women's Linen Wrap Dress",
    category: 'Women',
    department: 'Essentials',
    price: 2500,
    image: '/src/assets/images/product_womens_dress_1795274010849.jpg',
    material: 'Linen-Viscose Drape',
    fit: 'Belted Midi Silhouette',
    style: 'Wrap Midi Dress',
    tags: ['dress', 'women', 'linen'],
  },
  {
    id: 'bomber-jacket',
    name: 'Matte Utility Bomber Jacket',
    category: 'Outerwear',
    department: 'Essentials',
    price: 3500,
    image: '/src/assets/images/product_leather_jacket_1795274010283.jpg',
    material: 'Matte Twill Shell & Brass Zip',
    fit: 'Cropped Utility Cut',
    style: 'Bomber Outerwear',
    tags: ['jacket', 'outerwear', 'bomber'],
  },
  {
    id: 'leather-sneakers',
    name: 'Minimalist Court Sneakers',
    category: 'Footwear',
    department: 'Essentials',
    price: 3200,
    image: '/src/assets/images/product_minimalist_sneakers_1795274010362.jpg',
    material: 'Full-Grain Leather & Gum Sole',
    fit: 'Low-Top Court Profile',
    style: 'Leather Court Sneaker',
    tags: ['sneakers', 'shoes', 'footwear'],
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Hamza Tariq',
    rating: 5,
    comment:
      'Great quality clothes! Picked up the Oxford casual shirt on clearance and the Oversized Baggy Hoodie — both drape cleanly.',
    date: 'Nov 14, 2026',
    verifiedItem: 'Oversized Baggy Hoodie',
  },
  {
    id: 'rev-2',
    name: 'Ayesha Siddiqui',
    rating: 5,
    comment:
      'Ordered the linen wrap dress and ivory pleated top — true to size, breathable stitching, and quick doorstep delivery.',
    date: 'Nov 10, 2026',
    verifiedItem: "Women's Linen Wrap Dress",
  },
  {
    id: 'rev-3',
    name: 'Bilal Raza',
    rating: 5,
    comment:
      'The Animated Line-Art Hoodie print is sharp and the Utility Cargo Pants feel super durable for everyday wear.',
    date: 'Nov 03, 2026',
    verifiedItem: 'Utility Cargo Pants',
  },
];

export const WHATSAPP_NUMBER = '923001234567';
export const FREE_SHIPPING_THRESHOLD = 5000;
export const FLAT_SHIPPING_FEE = 250;

export function getDiscountPercent(product: Product): number {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0;
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
}
