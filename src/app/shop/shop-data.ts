

export type Color = {
  label: string;
  swatch: string;
  images?: string[];  
};

export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;       
  hoverImage: string;  // card hover image
  href: string;        // constructed from slug — keep for ProductCard
  tag: string;
  sizes: string[];
  comingSoon?: boolean;


  slug: string;
  category: string;
  images: string[];    
  colors: Color[];
  description: string;
  details: string;
  care: string;
  sizeChart?: string;
};

export const products: Product[] = [


  {
    // card
    id:         'CROSS-PLEATED-PANTS',
    name:       'Cross Pleated Pants',
    price:      'NRS 1590',
    image:      '/assets/images/MORE1.png',
    hoverImage: '/assets/images/BACK-IMAGE-GREY.jpeg',
    href:       '/shop/pleated-pants',
    tag:        'Available Now',
    sizes:      ['S', 'M', 'L'],

    // detail page
    slug:     'pleated-pants',
    category: 'Pants',
    images: [
      '/assets/images/MORE1.png', 
      '/assets/images/MORE2.png',   
      '/assets/images/MORE3.png',
      '/assets/images/SIZE-CHART.png',


    ],
    colors: [
      {
        label: 'Black',
        swatch: '#1A1A1A',
        images: [ '/assets/images/MORE1.png','/assets/images/MORE2.png', '/assets/images/MORE3.png'],
      },
      {
        label: 'Dark Grey',
        swatch: '#888884',
        images: ['/assets/images/FRONTGREY.png', '/assets/images/BACK-IMAGE-GREY.jpeg'],
      },
    ],
    description: 'Relaxed pleated pants designed for everyday wear. A wide silhouette with a clean drape.',
    details:     '65% Polyester | 35% Viscose.',
    care:        'Machine wash cold. Do not bleach. Line dry in shade. Low iron if needed.',
    sizeChart: '/assets/images/SIZE-CHART.png',
  },

  {
    id:         'HENLEY',
    name:       'HENLEY-TEE',
    price:      'NRS --',
    image:      '/assets/images/HENLEY.jpg',
    hoverImage: '/assets/images/whitehenley.jpg',
    href:       '/shop/the-drop-pant',
    tag:        'Coming Soon',
    sizes:      ['S', 'M', 'L'],
    comingSoon: true,

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
    id:         'CLASPCARDIGAN',
    name:       'CLASP FIREMAN KNITTED CARDIGAN',
    price:      'NRS --',
    image:      '/assets/images/FIREMANBLACK.jpeg',
    hoverImage: '/assets/images/FIREMANWHITE.jpeg',
    href:       '/shop/CLASPHOME',
    tag:        'Coming Soon',
    sizes:      ['S', 'M', 'L', 'XL'],
    comingSoon: true,

    // detail page
    slug:     'quarter-zips',
    category: 'Upper',
    images: [
      '/assets/images/FIREMANBLACK.jpeg',
      '/assets/images/FIREMANWHITE.jpeg',
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