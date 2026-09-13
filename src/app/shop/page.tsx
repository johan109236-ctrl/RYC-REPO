import ProductCard from '../components/ProductCard';
import { products } from './shop-data';
import './shop.css';

export default function ShopPage() {
  return (
    <main className="shop-page">
      <div className="shop-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}