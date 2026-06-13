# AI UX Insight — Stability Rebuild

This package is meant to stabilize the site in one pass.

It rebuilds:
- Landing page
- Pricing page
- Login page
- Signup page
- Auth callback
- Logo routing
- Buttons
- Billing card
- Stripe checkout
- Stripe portal
- Stripe webhook
- Settings billing display
- Global visual system / accessibility styles

## Required Vercel environment variables

```env
NEXT_PUBLIC_SITE_URL=https://www.aiuxinsight.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

Stripe webhook endpoint:

```text
https://www.aiuxinsight.com/api/stripe/webhook
```

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-stability-rebuild.zip
npm install stripe @supabase/supabase-js @supabase/ssr lucide-react
npm run build
git add .
git commit -m "Stabilize AI UX Insight auth billing and UI"
git push
```

Run this in Supabase SQL Editor:

```text
supabase/stability-rebuild.sql
```

Then redeploy Vercel with Clear Build Cache.
