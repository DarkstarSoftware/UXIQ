import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type CheckoutPlan = 'monthly' | 'annual' | 'lifetime';

const DEFAULT_MONTHLY_PRICE_ID = 'price_1TixPuGinRQd8iTxs17NzmyQ';
const DEFAULT_ANNUAL_PRICE_ID = 'price_1TixXjGinRQd8iTxZ9t2GF6Y';
const DEFAULT_LIFETIME_PRICE_ID = 'price_1TixXjGinRQd8iTxUQbz8TjD';

function getPlan(value: FormDataEntryValue | null): CheckoutPlan {
  if (value === 'annual') return 'annual';
  if (value === 'lifetime') return 'lifetime';
  return 'monthly';
}

function getPriceId(plan: CheckoutPlan) {
  if (plan === 'annual') {
    return process.env.STRIPE_PRO_ANNUAL_PRICE_ID || DEFAULT_ANNUAL_PRICE_ID;
  }

  if (plan === 'lifetime') {
    return process.env.STRIPE_LIFETIME_PRICE_ID || DEFAULT_LIFETIME_PRICE_ID;
  }

  return (
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID ||
    process.env.STRIPE_PRO_PRICE_ID ||
    DEFAULT_MONTHLY_PRICE_ID
  );
}

function getMode(plan: CheckoutPlan): Stripe.Checkout.SessionCreateParams.Mode {
  return plan === 'lifetime' ? 'payment' : 'subscription';
}

function getPlanMetadata(plan: CheckoutPlan) {
  if (plan === 'annual') {
    return {
      plan: 'pro_annual',
      billing_interval: 'year',
    };
  }

  if (plan === 'lifetime') {
    return {
      plan: 'pro_lifetime',
      billing_interval: 'lifetime',
    };
  }

  return {
    plan: 'pro',
    billing_interval: 'month',
  };
}

export async function GET() {
  return NextResponse.json(
    { error: 'Use POST to create a Stripe checkout session.' },
    { status: 405 },
  );
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aiuxinsight.com').replace(/\/$/, '');

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY.' }, { status: 500 });
  }

  const formData = await request.formData().catch(() => null);
  const plan = getPlan(formData?.get('plan') ?? null);
  const priceId = getPriceId(plan);

  if (!priceId) {
    return NextResponse.json({ error: `Missing Stripe price ID for ${plan} plan.` }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${siteUrl}/auth/login?redirect=/pricing`, 303);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  const stripe = new Stripe(stripeSecretKey);
  let customerId = profile?.stripe_customer_id ?? undefined;

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
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const metadata = {
    user_id: user.id,
    checkout_plan: plan,
    ...getPlanMetadata(plan),
  };

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: getMode(plan),
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/billing?checkout=success&plan=${plan}`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled&plan=${plan}`,
    allow_promotion_codes: true,
    metadata,
    subscription_data: plan === 'lifetime' ? undefined : { metadata },
    payment_intent_data: plan === 'lifetime' ? { metadata } : undefined,
  });

  if (!session.url) {
    return NextResponse.json({ error: 'Stripe did not return a checkout URL.' }, { status: 500 });
  }

  return NextResponse.redirect(session.url, 303);
}
