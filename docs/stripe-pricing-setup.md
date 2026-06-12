# Stripe Pricing Setup

## 1. Create Stripe Product

Product name:

```text
Darkstar Audit AI Pro
```

Pricing:

```text
$29/month recurring
```

Copy the price ID. It starts with:

```text
price_
```

## 2. Add Vercel Environment Variables

Project → Settings → Environment Variables:

```env
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## 3. Create Webhook

Stripe Dashboard → Developers → Webhooks → Add endpoint

Endpoint:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Events:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_failed
```

Copy webhook signing secret into:

```env
STRIPE_WEBHOOK_SECRET=
```

## 4. Test

1. Sign in
2. Go to Pricing
3. Click Start Pro
4. Complete Stripe checkout
5. Return to dashboard
6. Confirm Supabase `profiles.plan` becomes `pro`
7. Confirm Settings shows Pro
