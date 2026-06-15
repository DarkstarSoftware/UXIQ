# AIUX Insight — Screenshot Patch Auto Apply

This package removes the need to manually place patches.

It adds:
- `ReportScreenshotCard`
- screenshot URL support in `real-audit-engine.ts`
- screenshot card wiring into `app/reports/[id]/page.tsx`

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-screenshot-patches-ready.zip
node scripts/apply-screenshot-patches.mjs
npm run build
git add app components lib scripts
git commit -m "Wire screenshot support into reports"
git push
```

If `npm run build` passes, you are good.
