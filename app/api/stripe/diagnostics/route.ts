import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Sign in before running Stripe diagnostics.' },
      { status: 401 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;
  const secretKey = process.env.STRIPE_SECRET_KEY || null;
  const priceId = process.env.STRIPE_PRO_PRICE_ID || null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || null;

  const result: any = {
    configured: Boolean(siteUrl && secretKey && priceId),
    env: {
      NEXT_PUBLIC_SITE_URL: siteUrl ? 'set' : 'missing',
      STRIPE_SECRET_KEY: secretKey ? `set (${secretKey.startsWith('sk_live_') ? 'live' : secretKey.startsWith('sk_test_') ? 'test' : 'unknown mode'})` : 'missing',
      STRIPE_PRO_PRICE_ID: priceId ? `set (${priceId.startsWith('price_') ? 'valid prefix' : 'wrong prefix'})` : 'missing',
      STRIPE_WEBHOOK_SECRET: webhookSecret ? 'set' : 'missing',
    },
    price: {
      exists: false,
      active: false,
      recurring: false,
      currency: null,
      amount: null,
      interval: null,
    },
  };

  if (!secretKey || !priceId || !priceId.startsWith('price_')) {
    return NextResponse.json(result);
  }

  try {
    const stripe = new Stripe(secretKey);
    const price = await stripe.prices.retrieve(priceId);

    result.price = {
      exists: true,
      active: price.active,
      recurring: Boolean(price.recurring),
      currency: price.currency,
      amount: price.unit_amount,
      interval: price.recurring?.interval ?? null,
    };

    result.configured = Boolean(siteUrl && secretKey && priceId && price.active && price.recurring);
  } catch (error) {
    result.priceError =
      error instanceof Error
        ? error.message
        : 'Unable to retrieve Stripe Price. Check key mode and Price ID.';
  }

  return NextResponse.json(result);
}
