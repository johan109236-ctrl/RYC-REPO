'use client';

// Quick order page: the customer picks the product, colour, size and quantity
// from dropdowns (no cart needed), fills in delivery details and places the order.
// It reuses the same secure /api/notify-order route as the normal checkout, so
// prices come from the database and stock is checked on the server.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products } from '../shop/shop-data';
import { parsePrice } from '../context/CartContext';
import { quoteDelivery, deliveryLabel, INCLUDED_DELIVERY, type DeliveryArea } from '../shop/delivery-data';
import PaymentSection, { type PaymentProof } from '../components/PaymentSection';
import DeliveryPicker, {
  emptyDeliveryChoice,
  deliveryChoiceReady,
  deliveryChoiceForServer,
  deliveryChoiceText,
  type DeliveryChoice,
} from '../components/DeliveryPicker';
import '../checkout/checkout.css';

const MAX_QTY = 3;
const available = products.filter((p) => !p.comingSoon);

type StockRow = { color: string; size: string; stock: number };

export default function QuickOrderPage() {
  const [productId, setProductId] = useState(available[0]?.id ?? '');
  const product = available.find((p) => p.id === productId);

  const [color, setColor] = useState(available[0]?.colors[0]?.label ?? '');
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);

  // stock (capped at 3 by the API, so real inventory is never revealed)
  const [stockData, setStockData] = useState<{ product: string; rows: StockRow[] } | null>(null);

  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');
  const [proof, setProof] = useState<PaymentProof | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    deliveryArea: '',
    paymentMethod: '',
    amountPaid: '',
    notes: '',
  });

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  useEffect(() => {
    if (!product) return;
    let active = true;
    fetch(`/api/stock?product=${encodeURIComponent(product.name)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (active) setStockData({ product: product.name, rows: d.stock ?? [] });
      })
      .catch(() => {
        if (active) setStockData(null); // unknown: the server still checks stock when ordering
      });
    return () => {
      active = false;
    };
  }, [product]);

  const rows = stockData && product && stockData.product === product.name ? stockData.rows : null;

  // null = not known yet
  const stockOf = (c: string, s: string): number | null => {
    const row = rows?.find((r) => r.color.toLowerCase() === c.toLowerCase() && r.size === s);
    return row ? row.stock : rows ? 0 : null;
  };

  const currentStock = size ? stockOf(color, size) : null;
  const maxQty = currentStock === null ? MAX_QTY : Math.max(Math.min(currentStock, MAX_QTY), 1);
  const safeQty = Math.min(qty, maxQty);
  const soldOut = currentStock === 0;

  const onProductChange = (id: string) => {
    const next = available.find((p) => p.id === id);
    setProductId(id);
    setColor(next?.colors[0]?.label ?? '');
    setSize('');
    setQty(1);
  };

  const onColorChange = (c: string) => {
    setColor(c);
    if (size && stockOf(c, size) === 0) setSize('');
    setQty(1);
  };

  const unitPrice = product ? parsePrice(product.price) : 0;
  const lineTotal = unitPrice * safeQty;

  const [deliveryChoice, setDeliveryChoice] = useState<DeliveryChoice>(emptyDeliveryChoice);

  // delivery charge on top of the product price (null = confirmed separately)
  const quote = form.deliveryArea
    ? quoteDelivery(form.deliveryArea as DeliveryArea, deliveryChoice.district, deliveryChoice.municipality, deliveryChoice.spot)
    : { charge: null, place: null };
  const deliveryCharge = quote.charge ?? 0;
  const grandTotal = lineTotal + deliveryCharge;

  const canSubmit =
    !!product &&
    deliveryChoiceReady(form.deliveryArea, deliveryChoice) &&
    (product.colors.length === 0 || !!color) &&
    !!size &&
    !soldOut &&
    form.fullName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.deliveryArea &&
    !!form.paymentMethod &&
    (form.paymentMethod === 'cod' || !!proof) &&
    (form.paymentMethod !== 'partial' ||
      (Number(form.amountPaid) > 0 && Number(form.amountPaid) < grandTotal));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || placing || !product) return;

    setPlacing(true);
    setError('');

    try {
      const res = await fetch('/api/notify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: deliveryChoiceText(deliveryChoice) || 'Outside valley (not listed)',
          deliveryArea: form.deliveryArea,
          deliveryPlace: deliveryChoiceForServer(deliveryChoice),
          paymentMethod: form.paymentMethod,
          amountPaid: form.paymentMethod === 'partial' ? Number(form.amountPaid) : undefined,
          paymentProof: form.paymentMethod === 'cod' ? undefined : proof,
          notes: form.notes,
          items: [{ name: product.name, size, color, qty: safeQty, price: product.price }],
          total: grandTotal,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setPlaced(true);
    } catch (err) {
      console.error('Order failed:', err);
      setError(err instanceof Error && err.message ? err.message : "We couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (placed) {
    return (
      <main className="checkout-page">
        <div className="checkout-confirmation">
          <h1>Thank you, {form.fullName.split(' ')[0]}.</h1>
          <p>
            Your order has been received. We&apos;ll reach out at {form.phone} to confirm your delivery
            details.
          </p>
          <div className="checkout-summary" style={{ marginTop: 16 }}>
            <div className="checkout-total-row">
              <span>Delivery to</span>
              <span>
                {quote.place
                  ? deliveryLabel(form.deliveryArea as DeliveryArea, quote)
                  : form.deliveryArea === 'kathmandu-valley'
                    ? 'Kathmandu Valley'
                    : 'Outside the Valley'}
              </span>
            </div>
            <div className="checkout-total-row">
              <span>Delivery charge</span>
              <span>
                {quote.charge === null
                  ? 'To be confirmed'
                  : quote.charge === 0
                    ? 'Free'
                    : `NRS ${quote.charge.toLocaleString()}`}
              </span>
            </div>
            <div className="checkout-total-row checkout-total-grand">
              <span>Total{quote.charge === null ? ' (+ delivery)' : ''}</span>
              <span>NRS {grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/shop" className="checkout-continue-link">
            Continue shopping →
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="checkout-page">
        <div className="checkout-confirmation">
          <h1>Nothing available to order right now.</h1>
          <Link href="/shop" className="checkout-continue-link">
            Go to shop →
          </Link>
        </div>
      </main>
    );
  }

  const colorImage = product.colors.find((c) => c.label === color)?.images?.[0] ?? product.image;

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">Quick Order</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2 className="checkout-section-label">Your Selection</h2>

          <label className="checkout-field">
            Product
            <select value={productId} onChange={(e) => onProductChange(e.target.value)}>
              {available.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {product.colors.length > 0 && (
            <label className="checkout-field">
              Colour
              <select value={color} onChange={(e) => onColorChange(e.target.value)}>
                {product.colors.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="checkout-field">
            Size
            <select required value={size} onChange={(e) => { setSize(e.target.value); setQty(1); }}>
              <option value="">Select size</option>
              {product.sizes.map((s) => {
                const left = stockOf(color, s);
                return (
                  <option key={s} value={s} disabled={left === 0}>
                    {s}
                    {left === 0 ? ' (sold out)' : left !== null && left <= 2 ? ` (only ${left} left)` : ''}
                  </option>
                );
              })}
            </select>
          </label>

          {size && currentStock !== null && currentStock > 0 && currentStock <= 2 && (
            <p className="checkout-delivery-note">Only {currentStock} left in this size.</p>
          )}

          <label className="checkout-field">
            Quantity
            <select value={safeQty} onChange={(e) => setQty(Number(e.target.value))}>
              {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <h2 className="checkout-section-label">Delivery Details</h2>

          <label className="checkout-field">
            Full Name
            <input required value={form.fullName} onChange={update('fullName')} />
          </label>

          <label className="checkout-field">
            Email
            <input type="email" required value={form.email} onChange={update('email')} />
          </label>

          <label className="checkout-field">
            Phone
            <input type="tel" required value={form.phone} onChange={update('phone')} />
          </label>

          <DeliveryPicker
            area={form.deliveryArea}
            choice={deliveryChoice}
            onChange={setDeliveryChoice}
            onAreaChange={(a) => setForm((f) => ({ ...f, deliveryArea: a }))}
            quote={quote}
          />

          <label className="checkout-field">
            Address
            <input required value={form.address} onChange={update('address')} />
          </label>

          <PaymentSection
            method={form.paymentMethod}
            amountPaid={form.amountPaid}
            onMethod={(v) => setForm((f) => ({ ...f, paymentMethod: v }))}
            onAmount={(v) => setForm((f) => ({ ...f, amountPaid: v }))}
            total={grandTotal}
            deliveryCharge={quote.charge ?? 0}
            allowCod={true}
            showQr={false}
            allowDeliveryOnly={false}
            proof={proof}
            onProof={setProof}
          />

          <label className="checkout-field">
            Order Notes (optional)
            <textarea rows={3} value={form.notes} onChange={update('notes')} />
          </label>

          {error && <p className="checkout-error">{error}</p>}

          <button type="submit" className="checkout-submit-btn" disabled={!canSubmit || placing}>
            {placing ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2 className="checkout-section-label">Order Summary</h2>

          <div className="checkout-line">
            <img src={colorImage} alt={product.name} className="checkout-line-image" />

            <div className="checkout-line-info">
              <span className="checkout-line-name">{product.name}</span>
              <span className="checkout-line-meta">
                {color && `${color} · `}
                {size ? `Size ${size}` : 'Select a size'} · Qty {safeQty}
              </span>
            </div>

            <span className="checkout-line-price">NRS {lineTotal.toLocaleString()}</span>
          </div>

          <hr className="checkout-divider" />

          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>NRS {lineTotal.toLocaleString()}</span>
          </div>

          <div className="checkout-total-row checkout-total-note">
            <span>Delivery</span>
            <span>
              {!form.deliveryArea
                ? 'Select location'
                : quote.charge === null
                  ? 'Confirmed separately'
                  : quote.charge === 0
                    ? <><s>NRS {INCLUDED_DELIVERY}</s> Free</>
                    : `NRS ${quote.charge.toLocaleString()}`}
            </span>
          </div>

          <hr className="checkout-divider" />

          <div className="checkout-total-row checkout-total-grand">
            <span>Total</span>
            <span>NRS {grandTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </main>
  );
}