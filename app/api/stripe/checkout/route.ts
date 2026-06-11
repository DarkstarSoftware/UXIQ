import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripeSecretKey || !priceId || !siteUrl) {
    return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${siteUrl}/auth/login?redirect=/pricing`);

  const stripe = new Stripe(stripeSecretKey);
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email ?? undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?upgraded=true`,
    cancel_url: `${siteUrl}/pricing?canceled=true`,
    metadata: { user_id: user.id },
  });

  return NextResponse.redirect(session.url ?? `${siteUrl}/pricing`);
}
