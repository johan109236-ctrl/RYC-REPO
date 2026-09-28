import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const NOTIFY_EMAIL = 'rycenepal@gmail.com';

export async function POST(request: Request) {
  let email = '';
  try {
    const body = await request.json();
    email = String(body.email ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'RYCE <orders@rycenp.com>',
      to: [NOTIFY_EMAIL],
      replyTo: email,
      subject: 'New subscriber',
      text: `New newsletter signup: ${email}`,
    });
  } catch (err) {
    console.error('Subscribe email failed:', err);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}