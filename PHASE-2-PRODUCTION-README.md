# Darkstar Audit AI — Phase 2 Production Bundle

This package is a production-oriented Phase 2 bundle for Darkstar Audit AI.

## Adds

- Supabase authenticated audits
- Protected dashboard/reports/competitors/settings
- Free vs Pro gating
- Saved reports
- Dashboard metrics
- Reports history
- Stripe Checkout route
- Stripe Portal route
- Stripe webhook route
- Supabase schema with RLS
- Basic free audit engine
- Pro AI audit path

## Install

```bash
npm install @supabase/ssr @supabase/supabase-js stripe openai cheerio lucide-react clsx
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=

NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Darkstar Audit AI
```

## Apply

```bash
unzip ~/Downloads/darkstar-phase-2-production.zip
npm install @supabase/ssr @supabase/supabase-js stripe openai cheerio lucide-react clsx
npm run build
git add .
git commit -m "Phase 2 production SaaS foundation"
git push
```

Run both SQL files in Supabase SQL Editor:
- `supabase/phase2-production.sql`
- `supabase/phase2-increment-function.sql`
