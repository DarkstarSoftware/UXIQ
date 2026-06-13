# Stripe + Vercel Checklist

Set this exactly:

```env
NEXT_PUBLIC_SITE_URL=https://www.aiuxinsight.com
```

Stripe webhook endpoint:

```text
https://www.aiuxinsight.com/api/stripe/webhook
```

Required Vercel env vars:

```env
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=https://www.aiuxinsight.com
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

After saving env vars:
- Redeploy
- Clear build cache
- Sign in
- Visit `/pricing`
- Click `Start Pro Checkout`
