# AI UX Insight — UXIQ Design System Application

This package applies the uploaded UXIQ-style design system across the site.

It updates:
- Global typography
- Heading scale
- Text color hierarchy
- Indigo primary palette
- Semantic colors
- Background/card/border colors
- Buttons
- Inputs
- Cards
- Score cards
- Issue rows
- Sidebar
- Dashboard
- Reports
- Settings

## Apply

```bash
cd ~/Desktop/uxiq-auth-clean
unzip ~/Downloads/aiuxinsight-uxiq-design-system-application.zip
npm run build
git add .
git commit -m "Apply UXIQ design system globally"
git push
```

Then redeploy Vercel with Clear Build Cache.
