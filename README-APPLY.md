# AI UX Insight — Full Site UI Fix

This package replaces the broken marketing/pricing UI and fixes billing flow basics.

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-full-site-ui-fix.zip
npm run build
git add .
git commit -m "Fix full site UI accessibility and billing"
git push
```

Then redeploy Vercel with Clear Build Cache.

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
