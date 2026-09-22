import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import OrderNotificationEmail from '@/app/components/OrderNotificationEmail';
import CustomerOrderConfirmationEmail from '@/app/components/Customerorderconfirmationemail';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

const NOTIFY_EMAIL = 'rycenepal@gmail.com';

const SUPABASE_ENABLED = false;

// Basic rate limit
const rateLimit = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

type OrderItem = {
  sku?: string;
  name: string;
  size?: string;
  color?: string;
  qty: number;
  price: string | number;
};

type OrderPayload = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryArea: 'kathmandu-valley' | 'outside-valley';
  paymentMethod: 'cod';
  notes?: string;
  items: OrderItem[];
  total: number;
};

export async function POST(request: Request) {
  // -----------------------------
  // RATE LIMIT
  // -----------------------------

  const ip = getClientIp(request);
  const now = Date.now();

  const current = rateLimit.get(ip);

  if (!current || now > current.resetAt) {
    rateLimit.set(ip, {
      count: 1,
      resetAt: now + RATE_WINDOW,
    });
  } else {
    current.count += 1;

    if (current.count > RATE_LIMIT) {
      return NextResponse.json(
        {
          error: 'Too many order attempts. Please try again later.',
        },
        { status: 429 }
      );
    }
  }

  // -----------------------------
  // READ REQUEST
  // -----------------------------

  let body: OrderPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const {
    fullName,
    email,
    phone,
    address,
    city,
    deliveryArea,
    paymentMethod,
    notes,
    items,
    total,
  } = body;

  // -----------------------------
  // VALIDATION
  // -----------------------------

  if (
    !fullName?.trim() ||
    !email?.trim() ||
    !phone?.trim() ||
    !address?.trim() ||
    !city?.trim() ||
    !deliveryArea ||
    !paymentMethod ||
    !items?.length ||
    total == null
  ) {
    return NextResponse.json(
      { error: 'Missing required order fields' },
      { status: 400 }
    );
  }

  if (
    deliveryArea !== 'kathmandu-valley' &&
    deliveryArea !== 'outside-valley'
  ) {
    return NextResponse.json(
      { error: 'Invalid delivery location' },
      { status: 400 }
    );
  }

  if (paymentMethod !== 'cod') {
    return NextResponse.json(
      { error: 'Only Cash on Delivery is currently available' },
      { status: 400 }
    );
  }

  // -----------------------------
  // ORDER ID
  // -----------------------------

  let orderId: string;

  if (SUPABASE_ENABLED) {
    // Keep your existing Supabase order-saving logic here
    // if you enable Supabase later.
    orderId = `TEMP-${Date.now()}`;
  } else {
    orderId = `TEMP-${Date.now()}`;
  }

  // -----------------------------
  // ADMIN EMAIL
  // -----------------------------

  resend.emails
    .send({
      from: 'orders@rycenp.com',
      to: [NOTIFY_EMAIL],
      subject: `New order from ${fullName}`,
      react: OrderNotificationEmail({
        fullName,
        email,
        phone,
        address,
        city,
        deliveryArea,
        paymentMethod,
        notes,
        items,
        total,
        orderId,
      }),
    })
    .catch((err) => {
      console.error(
        'Order saved, but admin notification email failed:',
        err
      );
    });

  // -----------------------------
  // CUSTOMER CONFIRMATION EMAIL
  // -----------------------------

  if (email.trim()) {
    resend.emails
      .send({
        from: 'RYCE Orders <orders@rycenp.com>',
        to: [email.trim()],
        replyTo: NOTIFY_EMAIL,
        subject: 'We’ve received your order',
        react: CustomerOrderConfirmationEmail({
          name: fullName,
          orderId,
          total,
        }),
      })
      .catch((err) => {
        console.error(
          'Order saved, but customer auto-reply email failed:',
          err
        );
      });
  }

  return NextResponse.json({
    success: true,
    orderId,
  });
}