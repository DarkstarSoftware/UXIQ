# Darkstar Audit AI — Stripe + Pricing Fix

This package makes the Free → Pro upgrade path work.

## Includes

- Pricing page with working Stripe checkout form
- Checkout API route
- Customer portal API route
- Stripe webhook route
- Billing card component
- Supabase billing schema
- Stripe setup checklist

## Required Environment Variables

Add these in Vercel and local `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://your-live-domain.vercel.app

STRIPE_SECRET_KEY=sk_test_or_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRO_PRICE_ID=price_xxx

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/darkstar-stripe-pricing-fix.zip
npm install stripe
npm run build
git add .
git commit -m "Fix Stripe pricing and billing flow"
git push
```

## Supabase

Run:

```text
supabase/stripe-pricing-fix.sql
```
