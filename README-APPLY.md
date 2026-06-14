# AIUX Insight — Dynamic Audit Repair

This fixes the issue where entering `powderiq.com` still showed a Nike report.

## What changes

- The audit route now redirects with the submitted URL.
- Report detail page builds a site-specific audit from the submitted URL.
- PowderIQ, or any typed domain, appears as the report name.
- Scores, issues, recommendations, and roadmap are generated from the submitted domain.
- Roadmap keeps the submitted URL/report context.
- No forced fallback to Nike unless no URL/report is provided.
- Dashboard keeps users in flow after analysis.

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-dynamic-audit-repair.zip
npm run build
git add app/api/audit/route.ts app/reports/[id]/page.tsx app/roadmaps/page.tsx lib/audit-engine.ts lib/demo-data.ts
git commit -m "Make audit reports dynamic by submitted URL"
git push
```

Then redeploy Vercel with Clear Build Cache.
