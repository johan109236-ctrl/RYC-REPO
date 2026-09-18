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
  comingSoon?: boolean;

  // ── Slug page fields

  // ── Slug page fields (product detail) ───────────────────
  slug: string;
  category: string;
  images: string[];    // all photos, stacked in gallery
  colors: Color[];
  description: string;
  details: string;
  care: string;
  sizeChart?: string;
};

export const products: Product[] = [

  // ─────────────────────────────────────────────────────────
  //  PLEATED PANTS
  // ─────────────────────────────────────────────────────────
  {
    // card
    id:         'CROSS-PLEATED-PANTS',
    name:       'Cross Pleated Pants',
    price:      'NRS 1500',
    image:      '/assets/images/HOME.jpg',
    hoverImage: '/assets/images/HOMER.jpg',
    href:       '/shop/pleated-pants',
    tag:        'Available Now',
    sizes:      ['S', 'M', 'L'],

    // detail page
    slug:     'pleated-pants',
    category: 'Pants',
    images: [
      '/assets/images/BLACK1.jpeg', 
      '/assets/images/HOME.jpg',   
      '/assets/images/HOMER.jpg',
      '/assets/images/SIZE-CHART.png',


    ],
    colors: [
      {
        label: 'Black',
        swatch: '#1A1A1A',
        images: ['/assets/images/BLACK1.jpeg', '/assets/images/HOME.jpg'],
      },
      {
        label: 'Dark Grey',
        swatch: '#888884',
        images: ['/assets/images/HOMER.jpg', '/assets/images/GREY1.jpeg', '/assets/images/BACK-IMAGE-GREY.jpeg'],
      },
    ],
    description: 'Relaxed pleated pants designed for everyday wear. A wide silhouette with a clean drape.',
    details:     '100% Cotton. Relaxed fit. Elasticated waistband with drawstring. Two side pockets.',
    care:        'Machine wash cold. Do not bleach. Line dry in shade. Low iron if needed.',
    sizeChart: '/assets/images/SIZE-CHART.png',
  },

  // ─────────────────────────────────────────────────────────
  //  THE DROP PANT
  // ─────────────────────────────────────────────────────────
  {
    // card
    id:         'HENLEY',
    name:       'HENLEY-TEE',
    price:      'NRS ???',
    image:      '/assets/images/HENLEY.jpg',
    hoverImage: '/assets/images/HENLEY1.jpg',
    href:       '/shop/the-drop-pant',
    tag:        'Coming Soon',
    sizes:      ['S', 'M', 'L'],
    comingSoon: true,

    // detail page
    slug:     'HENLEY',
    category: 'HENLEY',
    images: [
      '/assets/images/HENLEY.jpg',
      '/assets/images/HENLEY.jpg',
    ],
    colors: [
      {
        label: 'Black',
        swatch: '#1A1A1A',
        images: ['/assets/images/HENLEY.jpeg', '/assets/images/HENLEY.jpeg'],
      },
      {
        label: 'Grey',
        swatch: '#888884',
        images: ['/assets/images/HENLEY.jpeg', '/assets/images/HENLEY.jpeg'],
      },
    ],
    description: 'A relaxed everyday pant with a wide dropped silhouette.',
    details:     '100% Cotton. Dropped crotch. Side pockets. Elasticated waist.',
    care:        'Machine wash cold. Line dry. Low iron.',
  },


  {
    // card
    id:         'CLASPHOME',
    name:       'CLASP HOME',
    price:      'NRS ??',
    image:      '/assets/images/CLASPHOME.jpeg',
    hoverImage: '/assets/images/CLASPHOME.jpeg',
    href:       '/shop/CLASPHOME',
    tag:        'Coming Soon',
    sizes:      ['S', 'M', 'L', 'XL'],
    comingSoon: true,

    // detail page
    slug:     'quarter-zips',
    category: 'Upper',
    images: [
      '/assets/images/CLASPHOME.jpeg',
      '/assets/images/CLASPHOME.jpeg',
    ],
    colors: [
      { label: 'Navy',  swatch: '#1C2B4A' },
      { label: 'Cream', swatch: '#E8E0D0' },
    ],
    description: 'A clean clasp jacket made for winters',
    details:     '100% Cotton fleece. Ribbed cuffs and hem. Metal zip.',
    care:        'Machine wash cold. Tumble dry low. Do not iron zip.',

  },

  

];