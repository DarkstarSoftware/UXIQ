# Darkstar Audit AI — Phase 6 Billing

Adds Stripe Checkout, Customer Portal, webhook handling, Supabase billing fields, pricing updates, and billing UI.

## Install

npm install stripe

## Env vars

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_SITE_URL=

Also required:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

## Supabase

Run `supabase/phase6-billing.sql`.

## Apply

cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/darkstar-phase-6-billing.zip
npm install stripe
npm run build
git add .
git commit -m "Phase 6 billing and subscription management"
git push
