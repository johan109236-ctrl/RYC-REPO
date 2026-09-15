'use client';

import { useState } from 'react';
import Link from 'next/link';
import './productCard.css';
import { useCart } from '../context/CartContext';

export type Product = {
  id: string;
  slug?: string;
  name: string;
  price: string;
  image: string;
  hoverImage: string;
  href: string;
  tag?: string;
  sizes: string[];
  colors?: { label: string; swatch: string }[];
  comingSoon?: boolean;
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
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted((prev) => !prev);
    onToggleWishlist?.(product);
  };

  const handleAddToCart = () => {
    if (product.comingSoon || !selectedSize) return;
    // Card view has no colour picker, so default to the product's first
    // colour (if it has one) — the shopper can change it on the product page.
    addItem({
      id: product.id,
      slug: product.slug ?? product.href.replace('/shop/', ''),
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: product.colors?.[0]?.label,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
    onAddToCart?.(product, selectedSize);
  };

  return (
    <div className="product-card">
      <div className="product-card-media">
        <Link href={product.href} className="product-card-image-link" aria-label={product.name}>
          <img src={product.image} alt={product.name} className="product-card-image product-card-image--default" />
          <img src={product.hoverImage} alt="" className="product-card-image product-card-image--hover" />
        </Link>

                {product.tag && (
          <span className={`product-card-tag ${product.comingSoon ? 'product-card-tag--soon' : ''}`}>
            {product.tag}
          </span>
        )}

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
              disabled={product.comingSoon}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="product-card-add-btn"
          onClick={handleAddToCart}
          disabled={product.comingSoon || !selectedSize}
        >
          {product.comingSoon ? 'Coming Soon' : justAdded ? 'Added ✓' : selectedSize ? 'Add to Cart' : 'Select a Size'}
        </button>
      </div>
    </div>
  );
}