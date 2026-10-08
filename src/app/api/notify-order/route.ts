// src/app/api/notify-order/route.ts
import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import OrderNotificationEmail from '@/app/components/OrderNotificationEmail';
import CustomerOrderConfirmationEmail from '@/app/components/Customerorderconfirmationemail';
import { quoteDelivery, deliveryLabel } from '@/app/shop/delivery-data';

const NOTIFY_EMAIL = 'rycenepal@gmail.com';

// Temporary in-memory limiter (per serverless instance). Replace with Upstash later.
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000;

const MAX_QTY_PER_VARIANT = 3;
const MAX_LINE_ITEMS = 10;

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
  price?: string | number; // ignored: the server uses the database price
};

type OrderPayload = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  deliveryArea: 'kathmandu-valley' | 'outside-valley';
  deliveryPlace?: { district: string; place: string; spot?: string } | null;
  paymentMethod: 'cod' | 'delivery_only' | 'partial' | 'full';
  amountPaid?: number;
  paymentProof?: { filename: string; type: string; content: string } | null;
  notes?: string;
  items: OrderItem[];
  total?: number; // ignored: the server calculates the total
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const current = rateLimit.get(ip);

  if (!current || now > current.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
  } else {
    current.count += 1;
    if (current.count > RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Too many order attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }

  let body: OrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    fullName,
    email,
    phone,
    address,
    city,
    deliveryArea,
    deliveryPlace,
    paymentMethod,
    amountPaid,
    paymentProof,
    notes,
    items,
  } = body ?? ({} as OrderPayload);

  if (
    typeof fullName !== 'string' || !fullName.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof phone !== 'string' || !phone.trim() ||
    typeof address !== 'string' || !address.trim() ||
    typeof city !== 'string' || !city.trim() ||
    !deliveryArea ||
    !paymentMethod ||
    !Array.isArray(items) || !items.length
  ) {
    return NextResponse.json(
      { error: 'Missing required order fields' },
      { status: 400 }
    );
  }

  if (deliveryArea !== 'kathmandu-valley' && deliveryArea !== 'outside-valley') {
    return NextResponse.json({ error: 'Invalid delivery location' }, { status: 400 });
  }

  // The delivery charge is worked out here on the server (never trusted from the browser).
  const quote = quoteDelivery(deliveryArea, deliveryPlace?.district, deliveryPlace?.place, deliveryPlace?.spot);
  if (quote.error) {
    return NextResponse.json({ error: 'Invalid delivery location' }, { status: 400 });
  }

  if (!['cod', 'delivery_only', 'partial', 'full'].includes(paymentMethod)) {
    return NextResponse.json({ error: 'Please choose a payment option' }, { status: 400 });
  }

  // Payment screenshot: only attached to the order email, never stored anywhere.
  let proofBuffer: Buffer | null = null;
  if (paymentMethod !== 'cod') {
    const okProof =
      paymentProof &&
      typeof paymentProof.content === 'string' &&
      paymentProof.content.length > 100 &&
      paymentProof.content.length < 2_500_000;
    if (okProof) proofBuffer = Buffer.from(paymentProof!.content, 'base64');
    // a real JPEG starts with the bytes FF D8
    if (!proofBuffer || proofBuffer[0] !== 0xff || proofBuffer[1] !== 0xd8) {
      return NextResponse.json({ error: 'Please upload your payment screenshot.' }, { status: 400 });
    }
  }

  // Basic sanity limits so nobody can stuff huge text into your emails/database
  if (
    !EMAIL_RE.test(email.trim()) ||
    email.length > 200 ||
    fullName.length > 150 ||
    phone.length > 30 ||
    address.length > 300 ||
    city.length > 100 ||
    (typeof notes === 'string' && notes.length > 1000) ||
    items.length > MAX_LINE_ITEMS
  ) {
    return NextResponse.json({ error: 'Invalid order details' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is missing');
    return NextResponse.json(
      { error: 'Order email service is not configured.' },
      { status: 500 }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase env variables are missing');
    return NextResponse.json(
      { error: 'Order service is not configured.' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: variantRows, error: variantsError } = await supabase
    .from('product_variants')
    .select('id, color, size, price, products(name)');

  if (variantsError || !variantRows) {
    console.error('Could not load variants:', variantsError);
    return NextResponse.json(
      { error: 'We could not process your order. Please try again.' },
      { status: 500 }
    );
  }

  const variants = variantRows as any[];
  const norm = (s?: string) => (s ?? '').trim().toLowerCase();

  // variant id -> total quantity across all lines (so the same variant sent
  // twice cannot get around the per-order limit)
  const qtyByVariant = new Map<number, number>();
  const emailItems: any[] = [];
  let calculatedTotal = 0;

  for (const item of items) {
    if (
      !item ||
      !Number.isInteger(item.qty) ||
      item.qty < 1 ||
      item.qty > MAX_QTY_PER_VARIANT
    ) {
      return NextResponse.json({ error: 'Invalid quantity.' }, { status: 400 });
    }

    const match = variants.find((v) => {
      const product = Array.isArray(v.products) ? v.products[0] : v.products;
      return (
        norm(product?.name) === norm(item.name) &&
        norm(v.color) === norm(item.color) &&
        norm(v.size) === norm(item.size)
      );
    });

    if (!match) {
      return NextResponse.json(
        { error: `${item.name} (${item.color} / ${item.size}) is not available.` },
        { status: 400 }
      );
    }

    const dbPrice = Number(match.price);
    if (!Number.isFinite(dbPrice) || dbPrice <= 0) {
      console.error('Invalid price for variant', match.id);
      return NextResponse.json(
        { error: 'We could not process your order. Please try again.' },
        { status: 500 }
      );
    }

    const newQty = (qtyByVariant.get(match.id) ?? 0) + item.qty;
    if (newQty > MAX_QTY_PER_VARIANT) {
      return NextResponse.json({ error: 'Invalid quantity.' }, { status: 400 });
    }
    qtyByVariant.set(match.id, newQty);

    calculatedTotal += dbPrice * item.qty;

    // The emails show the database price, not the price the browser sent
    emailItems.push({ ...item, price: dbPrice });
  }

  // null = outside the valley and not in the rate list: confirmed separately
  const deliveryCharge = quote.charge;
  const orderTotal = calculatedTotal + (deliveryCharge ?? 0);
  const deliveryPlaceText = deliveryLabel(deliveryArea, quote);

  const dbItems = Array.from(qtyByVariant, ([variant_id, quantity]) => ({
    variant_id,
    quantity,
  }));

  const { data: dbOrderId, error: orderError } = await supabase.rpc('place_order', {
    p_name: fullName.trim(),
    p_phone: phone.trim(),
    p_email: email.trim(),
    p_address: address.trim(),
    p_location_type: deliveryArea === 'kathmandu-valley' ? 'inside_valley' : 'outside_valley',
    p_city_district: deliveryArea === 'kathmandu-valley' ? null : city.trim(),
    p_items: dbItems,
  });

  if (orderError) {
    console.error('place_order failed:', orderError);

    if (orderError.message?.includes('Out of stock')) {
      return NextResponse.json(
        { error: 'Sorry, one of the items you picked just sold out.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'We could not process your order. Please try again.' },
      { status: 500 }
    );
  }

  // payment option the customer chose (we still confirm the payment ourselves)
  if (paymentMethod === 'partial' && !(typeof amountPaid === 'number' && amountPaid > 0 && amountPaid < orderTotal)) {
    return NextResponse.json({ error: 'Enter the amount you paid (less than the total)' }, { status: 400 });
  }
  const paymentLabels = {
    cod: 'Cash on delivery',
    delivery_only: 'Customer says: delivery charge paid online, rest on delivery',
    partial: `Customer says: NRS ${amountPaid} paid online, rest on delivery`,
    full: 'Customer says: paid in full online',
  } as const;
  const paymentLine = `PAYMENT: ${paymentLabels[paymentMethod]}.`;
  const notesWithPayment = [paymentLine, notes].filter(Boolean).join('\n');

  // Save the delivery charge on the order so the admin can show what to collect.
  // If the delivery columns don't exist yet the order is still kept and emailed.
  const { error: deliverySaveError } = await supabase
    .from('orders')
    .update({ delivery_charge: deliveryCharge, delivery_place: deliveryPlaceText })
    .eq('id', dbOrderId);
  if (deliverySaveError) {
    console.error('Could not save delivery charge on order:', deliverySaveError);
  }

  const { error: paymentSaveError } = await supabase
    .from('orders')
    .update({
      payment_status:
        paymentMethod === 'full' ? 'paid_full' : paymentMethod === 'delivery_only' ? 'delivery_paid' : paymentMethod === 'partial' ? 'partial' : 'unpaid',
      amount_paid: paymentMethod === 'partial' ? amountPaid : null,
    })
    .eq('id', dbOrderId);
  if (paymentSaveError) {
    console.error('Could not save payment info on order:', paymentSaveError);
  }

  const orderId = `RYCE-${dbOrderId}`;
  const resend = new Resend(apiKey);

  try {
    const adminHtml = await render(
      OrderNotificationEmail({
        fullName,
        email,
        phone,
        address,
        city,
        deliveryArea,
        paymentMethod: 'cod' as const,
        notes: notesWithPayment,
        items: emailItems,
        total: orderTotal,
        deliveryCharge,
        deliveryPlace: deliveryPlaceText,
        orderId,
      })
    );

    const adminResult = await resend.emails.send({
      from: 'orders@rycenp.com',
      to: [NOTIFY_EMAIL],
      subject: `New order from ${fullName} — ${orderId}`,
      html: adminHtml,
      ...(proofBuffer
        ? { attachments: [{ filename: `${orderId}-payment-proof.jpg`, content: proofBuffer }] }
        : {}),
    });

    if (adminResult.error) {
      console.error('Admin order email failed:', adminResult.error);
    } else {
      console.log('Admin order email sent:', adminResult.data?.id);
    }
  } catch (error) {
    console.error('Admin order email exception:', error);
  }

  let customerEmailSent = false;

  try {
    const customerHtml = await render(
      CustomerOrderConfirmationEmail({
        name: fullName,
        orderId,
        total: orderTotal,
        deliveryArea,
        deliveryCharge,
        deliveryPlace: deliveryPlaceText,
      })
    );

    const customerResult = await resend.emails.send({
      from: 'RYCE Orders <orders@rycenp.com>',
      to: [email.trim()],
      replyTo: NOTIFY_EMAIL,
      subject: 'We’ve received your order',
      html: customerHtml,
    });

    if (customerResult.error) {
      console.error('Customer confirmation email failed:', customerResult.error);
    } else {
      customerEmailSent = true;
      console.log('Customer confirmation email sent:', customerResult.data?.id);
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