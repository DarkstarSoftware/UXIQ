# AIUX Insight Design System

## Brand Direction

AIUX Insight should feel:

- Premium
- Analytical
- Trustworthy
- Accessibility-aware
- SaaS / enterprise ready
- Clean, not overly bold
- Dark-mode first

The UI should avoid oversized bold typography everywhere. Use bold weight only for major hierarchy, scores, labels, and CTAs.

---

## Color System

### Background

| Token | Hex | Use |
|---|---:|---|
| `--aiux-bg` | `#0B0F19` | Main app background |
| `--aiux-bg-raised` | `#111827` | Header/sidebar background |
| `--aiux-card` | `#1F2937` | Cards and panels |
| `--aiux-card-soft` | `#263244` | Inputs and secondary panels |
| `--aiux-border` | `#374151` | Default borders |

### Text

| Token | Hex | Use |
|---|---:|---|
| `--aiux-text` | `#F8FAFC` | Primary text |
| `--aiux-text-soft` | `#E5E7EB` | Secondary headings |
| `--aiux-muted` | `#CBD5E1` | Body/support text |
| `--aiux-muted-2` | `#94A3B8` | Metadata/helper text |

### Brand

| Token | Hex | Use |
|---|---:|---|
| `--aiux-indigo-500` | `#6366F1` | Primary brand |
| `--aiux-indigo-600` | `#4F46E5` | Primary hover/active |
| `--aiux-blue` | `#3B82F6` | Accent / links |

### Semantic

| Token | Hex | Use |
|---|---:|---|
| `--aiux-success` | `#22C65E` | Good scores / success |
| `--aiux-warning` | `#F5A00B` | Medium issues |
| `--aiux-error` | `#EF4444` | High issues / errors |
| `--aiux-focus` | `#FACC15` | Keyboard focus ring |

---

## Typography

Use Inter or system sans-serif.

### Type Scale

| Style | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| Display | 56–72px | 750–800 | 1.0 | Landing hero only |
| H1 | 40–48px | 750 | 1.05 | App page titles |
| H2 | 28–32px | 700 | 1.15 | Section titles |
| H3 | 20–24px | 650 | 1.25 | Card titles |
| Body | 16px | 400–500 | 1.6 | Main text |
| Small | 14px | 400–600 | 1.45 | Metadata/forms |
| Label | 12px | 700 | 1.2 | Uppercase labels |

### Rules

- Do not use `font-black` or `font-extrabold` everywhere.
- Scores may use heavier weights.
- Body text should never be smaller than 14px.
- Use 1.5–1.7 line-height for paragraphs.
- Avoid overlapping text by using `line-height`, not fixed heights.

---

## Components

### Buttons

Minimum height: 44px.

Primary button:
- Indigo gradient
- White text
- Strong contrast
- Clear focus ring

Secondary button:
- Dark card background
- Border visible
- Muted white text

Danger button:
- Red background
- Use only for destructive actions

### Inputs

Inputs must include:
- Visible label
- 44px minimum height
- 3px keyboard focus ring
- Placeholder is not a replacement for label

### Cards

Cards use:
- `#1F2937`
- `#374151` border
- 16px radius
- 24px padding desktop
- 18–20px padding mobile

### Badges

High:
- Red background tint
- White/red text

Medium:
- Amber background tint

Low:
- Slate background tint

### Score Cards

Scores should use:
- Large number
- Clear supporting label
- Color-coded risk status
- Never rely on color alone; include text label

---

## Accessibility

Target WCAG 2.2 AA.

Rules:

- Text contrast minimum 4.5:1.
- Large text contrast minimum 3:1.
- Interactive targets minimum 44px high.
- Focus states must be visible.
- Never rely on color alone for severity.
- Forms need explicit labels.
- Avoid text over complex gradients unless contrast is guaranteed.
- Do not place muted text on low-contrast card backgrounds.
- Sidebar active state must include more than color: background + border + icon/text change.

---

## Layout

### App Shell

- Sidebar width: 272px
- Main content max readable width where needed
- Page padding: 32–34px desktop, 20–22px mobile
- Grid gap: 18–24px

### Cards

Use consistent spacing:
- Card padding: 24px
- Card radius: 16px
- Internal vertical rhythm: 12px / 16px / 24px
