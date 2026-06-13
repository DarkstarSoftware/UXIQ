# AI UX Insight — Full Core Repair

This is a stabilizing repair package for the whole app experience.

It replaces:
- Global CSS/design system
- Button
- Input
- Logo
- App shell
- Sidebar
- Landing page
- Login page
- Signup page
- Auth callback
- Dashboard
- Pricing
- Settings
- Billing
- Reports
- Competitors
- Roadmaps
- Clients
- Stripe checkout route

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-full-core-repair.zip
npm run build
git add .
git commit -m "Repair full AI UX Insight core app"
git push
```

Then redeploy Vercel with Clear Build Cache.

## Required env

```env
NEXT_PUBLIC_SITE_URL=https://www.aiuxinsight.com
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
```

Stripe webhook:

```text
https://www.aiuxinsight.com/api/stripe/webhook
```
