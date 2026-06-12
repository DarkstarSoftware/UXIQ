import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripeSecretKey || !siteUrl) {
    return NextResponse.json(
      { error: 'Stripe portal is not configured.' },
      { status: 500 },
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${siteUrl}/auth/login?redirect=/settings`, 303);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.redirect(`${siteUrl}/pricing`, 303);
  }

  const stripe = new Stripe(stripeSecretKey);

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${siteUrl}/settings`,
  });

  return NextResponse.redirect(session.url, 303);
}
