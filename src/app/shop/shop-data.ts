// ─────────────────────────────────────────────────────────────
//  RYCE SHOP DATA
//  One file feeds both:
//    • /shop          → ProductCard (uses image, hoverImage, href)
//    • /shop/[slug]   → ProductPage (uses images, colors, description, etc.)
// ─────────────────────────────────────────────────────────────

export type Color = {
  label: string;
  swatch: string;
  images?: string[];  // optional — only if this color has its own photos
};

export type Product = {
  // ── Card fields (shop grid) ──────────────────────────────
  id: string;
  name: string;
  price: string;
  image: string;       // card front image
  hoverImage: string;  // card hover image
  href: string;        // constructed from slug — keep for ProductCard
  tag: string;
  sizes: string[];

  // ── Slug page fields (product detail) ───────────────────
  slug: string;
  category: string;
  images: string[];    // all photos, stacked in gallery
  colors: Color[];
  description: string;
  details: string;
  care: string;
};

export const products: Product[] = [

  // ─────────────────────────────────────────────────────────
  //  PLEATED PANTS
  // ─────────────────────────────────────────────────────────
  {
    // card
    id:         'pleated-pants',
    name:       'Pleated Pants',
    price:      'NRS 1500',
    image:      '/assets/images/PLEATED1.jpg',
    hoverImage: '/assets/images/PLEATED2.jpg',
    href:       '/shop/pleated-pants',
    tag:        'Available Now',
    sizes:      ['S', 'M', 'L', 'XL'],

    // detail page
    slug:     'pleated-pants',
    category: 'Pants',
    images: [
      '/assets/images/PLEATED1.jpg',   // front
      '/assets/images/PLEATED2.jpg',   // back
      // add more when you have them:
      // '/assets/images/PLEATED3.jpg',
      // '/assets/images/PLEATED4.jpg',
    ],
    colors: [
      { label: 'Olive', swatch: '#6B6B3A' },
      { label: 'Black', swatch: '#1A1A1A' },
      { label: 'Cream', swatch: '#E8E0D0' },
    ],
    description: 'Relaxed pleated pants designed for everyday wear. A wide silhouette with a clean drape.',
    details:     '100% Cotton. Relaxed fit. Elasticated waistband with drawstring. Two side pockets.',
    care:        'Machine wash cold. Do not bleach. Line dry in shade. Low iron if needed.',
  },

  // ─────────────────────────────────────────────────────────
  //  THE DROP PANT
  // ─────────────────────────────────────────────────────────
  {
    // card
    id:         'the-drop-pant',
    name:       'The Drop Pant',
    price:      'NRS 1500',
    image:      '/assets/images/1ST.jpeg',
    hoverImage: '/assets/images/2ND.jpeg',
    href:       '/shop/the-drop-pant',
    tag:        'Available Now',
    sizes:      ['S', 'M', 'L', 'XL'],

    // detail page
    slug:     'the-drop-pant',
    category: 'Pants',
    images: [
      '/assets/images/1ST.jpeg',
      '/assets/images/2ND.jpeg',
    ],
    colors: [
      { label: 'Black', swatch: '#1A1A1A' },
      { label: 'Grey',  swatch: '#888884' },
    ],
    description: 'A relaxed everyday pant with a wide dropped silhouette.',
    details:     '100% Cotton. Dropped crotch. Side pockets. Elasticated waist.',
    care:        'Machine wash cold. Line dry. Low iron.',
  },

  // ─────────────────────────────────────────────────────────
  //  QUARTER ZIPS
  // ─────────────────────────────────────────────────────────
  {
    // card
    id:         'quarter-zips',
    name:       'Quarter Zips',
    price:      'NRS 2500',
    image:      '/assets/images/1ST.jpeg',
    hoverImage: '/assets/images/2ND.jpeg',
    href:       '/shop/quarter-zips',
    tag:        'Available Now',
    sizes:      ['S', 'M', 'L', 'XL'],

    // detail page
    slug:     'quarter-zips',
    category: 'Upper',
    images: [
      '/assets/images/1ST.jpeg',
      '/assets/images/2ND.jpeg',
    ],
    colors: [
      { label: 'Navy',  swatch: '#1C2B4A' },
      { label: 'Cream', swatch: '#E8E0D0' },
    ],
    description: 'A clean quarter-zip in a boxy silhouette. Built for layering.',
    details:     '100% Cotton fleece. Ribbed cuffs and hem. Metal zip.',
    care:        'Machine wash cold. Tumble dry low. Do not iron zip.',
  },

  // ─────────────────────────────────────────────────────────
  //  PREMIUM GIRLS TRENCH COAT
  // ─────────────────────────────────────────────────────────
  {
    // card
    id:         'premium-girls-trench-coat',
    name:       'Premium Girls Trench Coat',
    price:      'NRS 1500',
    image:      '/assets/images/1ST.jpeg',
    hoverImage: '/assets/images/2ND.jpeg',
    href:       '/shop/premium-girls-trench-coat',
    tag:        'Available Now',
    sizes:      ['S', 'M', 'L', 'XL'],

    // detail page
    slug:     'premium-girls-trench-coat',
    category: 'Outerwear',
    images: [
      '/assets/images/1ST.jpeg',
      '/assets/images/2ND.jpeg',
    ],
    colors: [
      { label: 'Camel', swatch: '#C19A6B' },
      { label: 'Black', swatch: '#1A1A1A' },
    ],
    description: 'A structured trench coat with a tailored fit. Timeless outerwear for any season.',
    details:     'Outer: 60% Polyester, 40% Cotton. Fully lined. Belt included. Double-breasted.',
    care:        'Dry clean only. Store on hanger.',
  },

];