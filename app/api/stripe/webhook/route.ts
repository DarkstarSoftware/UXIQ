import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

function getPeriodEnd(subscription: Stripe.Subscription) {
  const value = subscription.items.data[0]?.current_period_end;
  return value ? new Date(value * 1000).toISOString() : null;
}

async function updateProfileFromSubscription(subscription: Stripe.Subscription) {
  const supabase = createAdminClient();
  const userId = subscription.metadata?.user_id;
  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;

  const plan = subscription.status === 'active' || subscription.status === 'trialing' ? 'pro' : 'free';

  const payload = {
    plan,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    subscription_current_period_end: getPeriodEnd(subscription),
  };

  if (userId) {
    await supabase.from('profiles').update(payload).eq('id', userId);
  } else {
    await supabase.from('profiles').update(payload).eq('stripe_customer_id', customerId);
  }
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const signature = (await headers()).get('stripe-signature');
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      await supabase
        .from('profiles')
        .update({
          plan: 'pro',
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
          stripe_subscription_id: typeof session.subscription === 'string' ? session.subscription : null,
          subscription_status: 'active',
          billing_email: session.customer_details?.email ?? session.customer_email ?? null,
        })
        .eq('id', userId);
    }
  }

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
    await updateProfileFromSubscription(event.data.object as Stripe.Subscription);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await supabase
      .from('profiles')
      .update({
        plan: 'free',
        subscription_status: 'canceled',
        subscription_current_period_end: null,
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

    if (customerId) {
      await supabase
        .from('profiles')
        .update({
          plan: 'free',
          subscription_status: 'past_due',
        })
        .eq('stripe_customer_id', customerId);
    }
  }

  return NextResponse.json({ received: true });
}
