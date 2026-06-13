# AIUX Insight Design System

This package defines a stable, WCAG-aware visual system for AIUX Insight.

It includes:

- Design tokens
- Typography scale
- Color palette
- Buttons
- Inputs
- Cards
- Badges
- Score cards
- App shell/sidebar
- Accessibility rules
- Global CSS implementation

## Apply

Copy the files into the project:

```bash
unzip ~/Downloads/aiuxinsight-design-system.zip
```

Then replace your current `app/globals.css` with:

```text
app/globals.css
```

Optional supporting files:

```text
lib/design-tokens.ts
docs/AIUX-DESIGN-SYSTEM.md
```

Then run:

```bash
npm run build
git add .
git commit -m "Add AIUX Insight design system"
git push
```
