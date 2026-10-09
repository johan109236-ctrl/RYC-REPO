'use client';

import { useState } from 'react';

// Screenshot of the payment. It is sent with the order and attached to the
// order email only. It is NOT saved in the database or on the server.
export type PaymentProof = { filename: string; type: string; content: string };

// shrink the photo in the browser so the order request stays small
function compressImage(file: File): Promise<PaymentProof> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1200;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Could not read the image'));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      URL.revokeObjectURL(url);
      resolve({
        filename: 'payment-proof.jpg',
        type: 'image/jpeg',
        content: dataUrl.split(',')[1] ?? '',
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Please choose an image (screenshot or photo).'));
    };
    img.src = url;
  });
}

const OPTIONS: [string, string][] = [
  ['cod', 'Cash on delivery (pay everything when it arrives)'],
  ['delivery_only', 'I paid the delivery charge (rest on delivery)'],
  ['partial', 'I paid part of the amount (rest on delivery)'],
  ['full', 'I paid in full'],
];

export default function PaymentSection({
  method,
  amountPaid,
  onMethod,
  onAmount,
  total,
  deliveryCharge,
  allowCod,
  showQr = true,
  proof,
  onProof,
}: {
  method: string;
  amountPaid: string;
  onMethod: (v: string) => void;
  onAmount: (v: string) => void;
  total: number; // grand total in NRS
  deliveryCharge: number; // extra delivery charge in NRS (0 if none)
  allowCod: boolean;
  showQr?: boolean; // true on /checkout, false on /order
  proof: PaymentProof | null;
  onProof: (p: PaymentProof | null) => void;
}) {
  const [proofError, setProofError] = useState('');
  const paid = method && method !== 'cod';

  const toPay =
    method === 'full' ? total : method === 'delivery_only' ? deliveryCharge : Number(amountPaid) || 0;

  return (
    <div className="checkout-field">
      <span>Payment *</span>

      {OPTIONS.filter(([v]) => allowCod || v !== 'cod').map(([value, label]) => (
        <label key={value} className="checkout-payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value={value}
            checked={method === value}
            onChange={() => {
              onMethod(value);
              if (value === 'cod') onProof(null);
            }}
            required
          />
          <span>{label}</span>
        </label>
      ))}

      {method === 'partial' && (
        <label className="checkout-field" style={{ marginTop: 8 }}>
          Amount you paid (NRS)
          <input
            required
            inputMode="numeric"
            value={amountPaid}
            onChange={(e) => onAmount(e.target.value)}
            placeholder={`Less than ${total.toLocaleString()}`}
          />
        </label>
      )}

      {showQr && (
        <div style={{ marginTop: 12 }}>
          <p className="checkout-payment-note" style={{ marginBottom: 8 }}>
            Scan this QR to pay{paid && toPay > 0 ? ` NRS ${toPay.toLocaleString()}` : ''}, then choose what you paid
            and upload the payment screenshot.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/payment-qr.png"
            alt="Payment QR code"
            width={220}
            height={220}
            style={{ display: 'block', marginBottom: 12, border: '1px solid #e7ded0', borderRadius: 8 }}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      )}

      {paid && (
        <div style={{ marginTop: 4 }}>
          <label className="checkout-field">
            Payment screenshot *
            <input
              type="file"
              accept="image/*"
              required={!proof}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                setProofError('');
                if (!file) return onProof(null);
                try {
                  onProof(await compressImage(file));
                } catch (err) {
                  onProof(null);
                  setProofError(err instanceof Error ? err.message : 'Could not use that image.');
                }
              }}
            />
          </label>
          {proof && <p className="checkout-payment-note">Screenshot added. It is only sent to us by email.</p>}
          {proofError && <p className="checkout-error">{proofError}</p>}
        </div>
      )}

      <p className="checkout-payment-note">We confirm every payment before dispatch.</p>
    </div>
  );
}