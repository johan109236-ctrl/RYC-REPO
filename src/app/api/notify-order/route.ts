import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import OrderNotificationEmail from '@/app/components/OrderNotificationEmail';
import CustomerOrderConfirmationEmail from '@/app/components/Customerorderconfirmationemail';

const NOTIFY_EMAIL = 'baltalai61@gmail.com';

const rateLimit = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000;

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



  const orderId = `RYCE-${Date.now()}`;



  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is missing');

    return NextResponse.json(
      { error: 'Order email service is not configured.' },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);



  try {
    const adminResult = await resend.emails.send({
      from: 'orders@rycenp.com',
      to: [NOTIFY_EMAIL],
      subject: `New order from ${fullName} — ${orderId}`,
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
    });

    if (adminResult.error) {
      console.error('Admin order email failed:', adminResult.error);

      return NextResponse.json(
        {
          error: 'We could not send your order to RYCE. Please try again.',
        },
        { status: 500 }
      );
    }

    console.log('Admin order email sent:', adminResult.data?.id);
  } catch (error) {
    console.error('Admin order email exception:', error);

    return NextResponse.json(
      {
        error: 'We could not process your order. Please try again.',
      },
      { status: 500 }
    );
  }



  let customerEmailSent = false;

  try {
    const customerResult = await resend.emails.send({
      from: 'RYCE Orders <orders@rycenp.com>',
      to: [email.trim()],
      replyTo: NOTIFY_EMAIL,
      subject: 'We’ve received your order',
      react: CustomerOrderConfirmationEmail({
        name: fullName,
        orderId,
        total,
      }),
    });

    if (customerResult.error) {
      console.error(
        'Customer confirmation email failed:',
        customerResult.error
      );
    } else {
      customerEmailSent = true;
      console.log(
        'Customer confirmation email sent:',
        customerResult.data?.id
      );
    }
  } catch (error) {
    console.error('Customer confirmation email exception:', error);
  }



  return NextResponse.json({
    success: true,
    orderId,
    customerEmailSent,
  });
}