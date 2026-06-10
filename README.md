# UXIQ SaaS Starter

AI-powered UX audit platform with Supabase auth, protected dashboard, free/basic audits, and paid-plan AI audits.

## What changed

- Landing page is now informative and does not allow anonymous audits.
- Users must create an account or sign in before analyzing a site.
- Supabase auth has been added.
- `/dashboard`, `/reports`, `/competitors`, and `/settings` are protected.
- Free users receive a basic Nielsen Norman-inspired and WCAG-aware audit.
- Paid users (`pro` or `agency` in Supabase `profiles.plan`) receive full OpenAI-powered audit output.

## Environment variables

Create `.env.local` locally and add these values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Add the same variables in Vercel Project Settings → Environment Variables. For production, set `NEXT_PUBLIC_SITE_URL` to your Vercel URL or custom domain.

## Supabase setup

1. Create a Supabase project.
2. Go to SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Go to Authentication → URL Configuration.
5. Set Site URL to your local URL during development and your Vercel URL in production.
6. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback`

## Run locally

```bash
npm install
npm run dev
```

## Deploy updates

```bash
git add .
git commit -m "Add Supabase auth and gated audit flow"
git push
```

Vercel will redeploy automatically.
