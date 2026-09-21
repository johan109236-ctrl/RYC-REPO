import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import OrderNotificationEmail from '@/app/components/OrderNotificationEmail';
import CustomerOrderConfirmationEmail from '@/app/components/Customerorderconfirmationemail';

// Server-only clients. SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY must
// NEVER be prefixed with NEXT_PUBLIC_ - that would expose them to the
// browser. This file only ever runs on the server (it's an API route), so
// the customer never sees it, the URLs, or the keys.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

// Update this to your own inbox - this is who gets the order alert email.
const NOTIFY_EMAIL = 'baltalai61@gmail.com';

// TEMP: Supabase stock/order-saving is disabled while that part is still
// being finished. Flip this back to true once product SKUs are set up in
// Supabase (see sql-add-sku.sql) to re-enable real stock subtraction.
const SUPABASE_ENABLED = false;

type OrderItem = {
  sku: string;
  name: string;
  size?: string;
  color?: string;
  qty: number;
  price: string | number;
};

type OrderPayload = {
  fullName: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: OrderItem[];
  total: number;
};

export async function POST(request: Request) {
  let body: OrderPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { fullName, email, phone, address, city, notes, items, total } = body;

  if (!fullName?.trim() || !phone?.trim() || !address?.trim() || !city?.trim() || !items?.length || total == null) {
    return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
  }

  let orderId: string;

  if (SUPABASE_ENABLED) {
    // place_order checks stock and subtracts it for every item, all-or-nothing.
    // If anything is out of stock, it throws and nothing gets subtracted.
    const { data, error } = await supabase.rpc('place_order', {
      p_full_name: fullName,
      p_email: email?.trim() || null,
      p_phone: phone,
      p_address: address,
      p_city: city,
      p_notes: notes?.trim() || null,
      p_items: items,
      p_total: total,
    });

    if (error) {
      console.error('place_order error:', error);
      // Out-of-stock errors raised inside the SQL function land here too -
      // surface a clearer status code for that case.
      const outOfStock = error.message?.includes('Not enough stock');
      return NextResponse.json(
        { error: outOfStock ? error.message : 'Failed to save order' },
        { status: outOfStock ? 409 : 500 }
      );
    }

    orderId = data;
  } else {
    // No Supabase save happening right now - this ID is just for the emails,
    // it isn't stored anywhere. Nothing is being logged or stock-tracked yet.
    orderId = `TEMP-${Date.now()}`;
  }

  // Best-effort emails. If these fail, the order is still saved and stock
  // already subtracted - we don't want a flaky email to undo a real order,
  // so both are fire-and-forget with just a log on failure.

  /* 1. Admin notification - to you */
  resend.emails
    .send({
      from: 'orders@rycenp.com',
      to: [NOTIFY_EMAIL],
      subject: `New order from ${fullName}`,
      react: OrderNotificationEmail({
        orderId,
        fullName,
        email: email?.trim() || undefined,
        phone,
        address,
        city,
        notes: notes?.trim() || undefined,
        items,
        total,
      }),
    })
    .catch((err) => {
      console.error('Order saved, but admin notification email failed:', err);
    });

  /* 2. Auto-reply - to the customer, only if they gave an email */
  if (email?.trim()) {
    resend.emails
      .send({
        from: 'RYCE Orders <orders@rycenp.com>',
        to: [email.trim()],
        replyTo: NOTIFY_EMAIL, // so hitting "reply" actually reaches you, not the orders@ address
        subject: 'We\u2019ve received your order',
        react: CustomerOrderConfirmationEmail({
          name: fullName,
          orderId,
          total,
        }),
      })
      .catch((err) => {
        console.error('Order saved, but customer auto-reply email failed:', err);
      });
  }

  return NextResponse.json({ success: true, orderId });
}