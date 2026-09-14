'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart, parsePrice } from '../context/CartContext';
import './checkout.css';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const canSubmit =
    items.length > 0 &&
    form.fullName.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    // NOTE: there is no payment gateway or backend order storage wired up
    // yet. This confirms the order in the UI and clears the cart, but for a
    // real store you'll need to send this to a backend / payment provider
    // (e.g. eSewa, Khalti, Stripe) before trusting it as a placed order.
    setPlacing(true);
    window.setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
      clearCart();
    }, 900);
  };

  if (placed) {
    return (
      <main className="checkout-page">
        <div className="checkout-confirmation">
          <h1>Thank you, {form.fullName.split(' ')[0]}.</h1>
          <p>Your order has been received. We&apos;ll reach out at {form.phone} to confirm delivery details.</p>
          <Link href="/shop" className="checkout-continue-link">
            Continue shopping →
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-confirmation">
          <h1>Your cart is empty.</h1>
          <Link href="/shop" className="checkout-continue-link">
            Go to shop →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2 className="checkout-section-label">Shipping Details</h2>

          <label className="checkout-field">
            Full Name
            <input required value={form.fullName} onChange={update('fullName')} />
          </label>

          <label className="checkout-field">
            Email
            <input type="email" value={form.email} onChange={update('email')} />
          </label>

          <label className="checkout-field">
            Phone
            <input required value={form.phone} onChange={update('phone')} />
          </label>

          <label className="checkout-field">
            Address
            <input required value={form.address} onChange={update('address')} />
          </label>

          <label className="checkout-field">
            City
            <input required value={form.city} onChange={update('city')} />
          </label>

          <label className="checkout-field">
            Order Notes (optional)
            <textarea rows={3} value={form.notes} onChange={update('notes')} />
          </label>

          <button type="submit" className="checkout-submit-btn" disabled={!canSubmit || placing}>
            {placing ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2 className="checkout-section-label">Order Summary</h2>
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color ?? ''}`} className="checkout-line">
              <img src={item.image} alt={item.name} className="checkout-line-image" />
              <div className="checkout-line-info">
                <span className="checkout-line-name">{item.name}</span>
                <span className="checkout-line-meta">
                  {item.color && `${item.color} · `}Size {item.size} · Qty {item.qty}
                </span>
              </div>
              <span className="checkout-line-price">
                NRS {(parsePrice(item.price) * item.qty).toLocaleString()}
              </span>
            </div>
          ))}

          <hr className="checkout-divider" />
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>NRS {subtotal.toLocaleString()}</span>
          </div>
          <div className="checkout-total-row checkout-total-note">
            <span>Shipping</span>
            <span>Calculated after order review</span>
          </div>
          <hr className="checkout-divider" />
          <div className="checkout-total-row checkout-total-grand">
            <span>Total</span>
            <span>NRS {subtotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
