'use client';

import { useState } from 'react';
import Link from 'next/link';
import './productCard.css';

export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  hoverImage: string;
  href: string;
  tag?: string;
  sizes: string[];
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product, size: string) => void;
  onQuickView?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted((prev) => !prev);
    onToggleWishlist?.(product);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    onAddToCart?.(product, selectedSize);
  };

  return (
    <div className="product-card">
      <div className="product-card-media">
        <Link href={product.href} className="product-card-image-link" aria-label={product.name}>
          <img src={product.image} alt={product.name} className="product-card-image product-card-image--default" />
          <img src={product.hoverImage} alt="" className="product-card-image product-card-image--hover" />
        </Link>

        {product.tag && <span className="product-card-tag">{product.tag}</span>}

        <button
          type="button"
          className={`product-card-wishlist ${isWishlisted ? 'is-active' : ''}`}
          onClick={handleWishlist}
          aria-label="Add to wishlist"
        >
          <i className={isWishlisted ? 'bi bi-heart-fill' : 'bi bi-heart'} />
        </button>

        <button
          type="button"
          className="product-card-quickview"
          onClick={() => onQuickView?.(product)}
        >
          Quick View
        </button>
      </div>

      <div className="product-card-info">
        <Link href={product.href} className="product-card-name">
          {product.name}
        </Link>
        <span className="product-card-price">{product.price}</span>

        <div className="product-card-sizes">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`product-card-size ${selectedSize === size ? 'is-selected' : ''}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="product-card-add-btn"
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          {selectedSize ? 'Add to Cart' : 'Select a Size'}
        </button>
      </div>
    </div>
  );
}