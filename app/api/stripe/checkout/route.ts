import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

function cleanSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxinsight.com').replace(/\/$/, '');
}

function missingEnv() {
  const missing: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!process.env.STRIPE_PRO_PRICE_ID) missing.push('STRIPE_PRO_PRICE_ID');
  if (!process.env.NEXT_PUBLIC_SITE_URL) missing.push('NEXT_PUBLIC_SITE_URL');
  return missing;
}

export async function POST() {
  const missing = missingEnv();

  if (missing.length) {
    return NextResponse.json(
      { error: `Stripe is not configured. Missing: ${missing.join(', ')}.` },
      { status: 500 },
    );
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
  const priceId = process.env.STRIPE_PRO_PRICE_ID!;
  const siteUrl = cleanSiteUrl();

  if (!priceId.startsWith('price_')) {
    return NextResponse.json(
      { error: 'STRIPE_PRO_PRICE_ID must be a Stripe Price ID that starts with price_, not a Product ID.' },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        error: 'You must be signed in before upgrading.',
        redirectTo: `${siteUrl}/auth/login?redirect=/pricing`,
      },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, stripe_customer_id')
    .eq('id', user.id)
    .single();

  const isAlreadyPro =
    profile?.plan === 'pro' ||
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing' ||
    profile?.subscription_status === 'lifetime';

  if (isAlreadyPro) {
    return NextResponse.json(
      { error: 'This account already has Pro access.', redirectTo: `${siteUrl}/billing` },
      { status: 409 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  let price: Stripe.Price;
  try {
    price = await stripe.prices.retrieve(priceId);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Stripe Price could not be found. Check that STRIPE_PRO_PRICE_ID belongs to the same Stripe mode as STRIPE_SECRET_KEY.',
      },
      { status: 500 },
    );
  }

  if (!price.active) {
    return NextResponse.json(
      { error: 'Stripe Price is inactive. Activate the Price in Stripe or use an active Price ID.' },
      { status: 500 },
    );
  }

  if (!price.recurring) {
    return NextResponse.json(
      { error: 'Stripe Price must be recurring for subscription checkout.' },
      { status: 500 },
    );
  }

  let customerId = profile?.stripe_customer_id || null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: {
        user_id: user.id,
      },
    });

    customerId = customer.id;

    await supabase
      .from('profiles')
      .update({
        stripe_customer_id: customerId,
        email: user.email ?? null,
        billing_email: user.email ?? null,
      })
      .eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
    success_url: `${siteUrl}/dashboard?billing=success`,
    cancel_url: `${siteUrl}/pricing?billing=cancelled`,
    metadata: {
      user_id: user.id,
    },
    subscription_data: {
      metadata: {
        user_id: user.id,
      },
    },
  });

  if (!session.url) {
    return NextResponse.json(
      { error: 'Stripe did not return a Checkout URL.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
