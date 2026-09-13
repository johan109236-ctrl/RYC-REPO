import ProductCard from '../components/ProductCard';
import './shop.css';

const products = [
  {
    id: 'the-drop',
    name: 'The Drop Pant',
    price: 'Rs. 2,199.00',
    image: '/assets/images/1ST.jpeg',
    hoverImage: '/assets/images/2ND.jpeg',
    href: '/products/the-drop',
    tag: 'Available Now',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export default function ShopPage() {
  return (
    <main className="shop-page">
      <div className="shop-header">
        <span className="shop-eyebrow">The Collection</span>
        <h1 className="shop-heading">Shop</h1>
      </div>

      <div className="shop-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}