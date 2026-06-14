# AIUX Insight — Production UX Features Package

Adds:
- Better Settings page
- Profile/avatar menu + logout
- BillingCard fix for lifetime vs Stripe users
- Competitor analysis workflow
- Supabase competitor table migration
- CSS additions for avatar menu

Apply:

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-production-ux-features.zip
cat app/globals.append.css >> app/globals.css
rm app/globals.append.css
npm run build
git add app components lib supabase
git commit -m "Add production UX settings profile and competitor features"
git push
```

Run in Supabase SQL editor:

```sql
supabase/production-ux-features.sql
```
