'use client';

import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { products } from '../shop/shop-data';
import './shop-preview.css';

export default function ShopPreview() {
  return (
    <section id="shop-preview">
      <div className="shop-preview-header">
        <span className="shop-preview-eyebrow">Our Collection</span>
        <h2 className="shop-preview-heading">Shop RYCE</h2>
        <Link href="/shop" className="shop-preview-view-all">
          View All →
        </Link>
      </div>

      <div className="shop-preview-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}