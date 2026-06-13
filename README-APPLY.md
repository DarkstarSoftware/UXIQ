# AI UX Insight — UI, Billing, Navigation & Accessibility Fix

Fixes:
- Stripe checkout flow
- Pricing and billing CTAs
- Logo click goes to `/dashboard`
- WCAG-friendly colors/focus states
- Stable UI CSS without fragile Tailwind `@apply`
- Todd lifetime Pro SQL helper

## Required Vercel env vars

```env
NEXT_PUBLIC_SITE_URL=https://www.aiuxinsight.com
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

Stripe webhook endpoint:

```text
https://www.aiuxinsight.com/api/stripe/webhook
```

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-ui-billing-accessibility-fix.zip
npm run build
git add .
git commit -m "Fix UI billing navigation and accessibility"
git push
```

Run this in Supabase SQL Editor if Todd still shows Free:

```text
supabase/pro-lifetime-fix.sql
```
