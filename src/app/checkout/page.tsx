'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart, parsePrice } from '../context/CartContext';
import './checkout.css';

const OUTSIDE_VALLEY_DELIVERY_FEE = 100;

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
    deliveryArea: '',
    paymentMethod: '',
    notes: '',
  });

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const deliveryFee = form.deliveryArea === 'outside-valley' ? OUTSIDE_VALLEY_DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const canSubmit =
    items.length > 0 &&
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.deliveryArea &&
    form.paymentMethod === 'cod';

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setPlacing(true);

    fetch('/api/notify-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        deliveryArea: form.deliveryArea,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        items: items.map((i) => ({
          name: i.name,
          size: i.size,
          color: i.color,
          qty: i.qty,
          price: i.price,
        })),
        total,
      }),
    }).catch((err) => {
      console.error('Order placed, but notification failed:', err);
    });

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
          <p>
            Your order has been received. We&apos;ll reach out at {form.phone} to
            confirm your delivery details.
          </p>
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
          <h2 className="checkout-section-label">Delivery Details</h2>

          <label className="checkout-field">
            Full Name
            <input
              required
              value={form.fullName}
              onChange={update('fullName')}
            />
          </label>

          <label className="checkout-field">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
            />
          </label>

          <label className="checkout-field">
            Phone
            <input
              type="tel"
              required
              value={form.phone}
              onChange={update('phone')}
            />
          </label>

          <label className="checkout-field">
            Delivery Location
            <select
              required
              value={form.deliveryArea}
              onChange={update('deliveryArea')}
            >
              <option value="">Select delivery location</option>
              <option value="kathmandu-valley">Kathmandu Valley</option>
              <option value="outside-valley">Outside Kathmandu Valley</option>
            </select>
          </label>

          {form.deliveryArea === 'kathmandu-valley' && (
            <p className="checkout-delivery-note">
              Delivery within Kathmandu Valley is included in the product price.
            </p>
          )}

          {form.deliveryArea === 'outside-valley' && (
            <p className="checkout-delivery-note">
              A flat delivery charge of NRS {OUTSIDE_VALLEY_DELIVERY_FEE} applies for
              locations outside Kathmandu Valley.
            </p>
          )}

          <label className="checkout-field">
            Address
            <input
              required
              value={form.address}
              onChange={update('address')}
            />
          </label>

          <label className="checkout-field">
            City / Area
            <input
              required
              value={form.city}
              onChange={update('city')}
            />
          </label>

          <div className="checkout-field">
            <span>Payment Method</span>

            <label className="checkout-payment-option">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={form.paymentMethod === 'cod'}
                onChange={update('paymentMethod')}
                required
              />
              <span>Cash on Delivery</span>
            </label>

            <p className="checkout-payment-note">
              Cash on Delivery is currently the only available payment method.
            </p>
          </div>

          <label className="checkout-field">
            Order Notes (optional)
            <textarea
              rows={3}
              value={form.notes}
              onChange={update('notes')}
            />
          </label>

          <button
            type="submit"
            className="checkout-submit-btn"
            disabled={!canSubmit || placing}
          >
            {placing ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2 className="checkout-section-label">Order Summary</h2>

          {items.map((item) => (
            <div
              key={`${item.id}-${item.size}-${item.color ?? ''}`}
              className="checkout-line"
            >
              <img
                src={item.image}
                alt={item.name}
                className="checkout-line-image"
              />

              <div className="checkout-line-info">
                <span className="checkout-line-name">{item.name}</span>

                <span className="checkout-line-meta">
                  {item.color && `${item.color} · `}
                  Size {item.size} · Qty {item.qty}
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
            <span>Delivery</span>

            <span>
              {form.deliveryArea === 'kathmandu-valley'
                ? 'Included'
                : form.deliveryArea === 'outside-valley'
                  ? `NRS ${OUTSIDE_VALLEY_DELIVERY_FEE}`
                  : 'Select location'}
            </span>
          </div>

          <hr className="checkout-divider" />

          <div className="checkout-total-row checkout-total-grand">
            <span>Total</span>
            <span>NRS {total.toLocaleString()}</span>
          </div>

          {form.deliveryArea === 'kathmandu-valley' && (
            <p className="checkout-summary-note">
              Kathmandu Valley delivery is included in the product price.
            </p>
          )}

          {form.deliveryArea === 'outside-valley' && (
            <p className="checkout-summary-note">
              A flat NRS {OUTSIDE_VALLEY_DELIVERY_FEE} delivery charge for locations
              outside Kathmandu Valley has been added to your total.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}