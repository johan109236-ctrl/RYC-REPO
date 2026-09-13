import { Product } from '../components/ProductCard';



export const products: Product[] = [
  {
    id: 'the-drop',
    name: 'The Drop Pant',
    price: 'NRS 1500',
    image: '/assets/images/1ST.jpeg',
    hoverImage: '/assets/images/2ND.jpeg',
    href: '/products/the-drop',
    tag: 'Available Now',
    sizes: ['S', 'M', 'L', 'XL'],
  },

  // Add more products below, same shape as above:
  // {
  //   id: 'unique-id',
  //   name: 'Product Name',
  //   price: 'Rs. 0,000.00',
  //   image: '/assets/images/your-image.jpg',
  //   hoverImage: '/assets/images/your-hover-image.jpg',
  //   href: '/products/your-slug',
  //   tag: 'New',
  //   sizes: ['S', 'M', 'L'],
  // },
];