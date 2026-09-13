'use client';

import Link from 'next/link';
import { useCart, parsePrice } from '../context/CartContext';
import './cart.css';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  return (
    <main className="cart-page">
      <h1 className="cart-title">Your Cart</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="cart-continue-link">
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color ?? ''}`} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />

                <div className="cart-item-info">
                  <Link href={`/shop/${item.slug}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <div className="cart-item-meta">
                    {item.color && <span>Colour: {item.color}</span>}
                    <span>Size: {item.size}</span>
                  </div>
                  <div className="cart-item-price">{item.price}</div>

                  <div className="cart-item-controls">
                    <div className="cart-qty-stepper">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-btn"
                      onClick={() => removeItem(item.id, item.size, item.color)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="cart-item-line-total">
                  NRS {(parsePrice(item.price) * item.qty).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2 className="cart-summary-title">Order Summary</h2>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>NRS {subtotal.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row cart-summary-note">
              <span>Shipping &amp; taxes</span>
              <span>Calculated at checkout</span>
            </div>
            <hr className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>NRS {subtotal.toLocaleString()}</span>
            </div>

            <Link href="/checkout" className="cart-checkout-btn">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="cart-continue-link">
              ← Continue shopping
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
