# Manual patches needed

## 1. `lib/real-audit-engine.ts`

Add this field to `AuditReport`:

```ts
screenshotUrl?: string;
```

Then in `dbReportToAuditReport`, add:

```ts
screenshotUrl: row.screenshot_url ?? raw.screenshotUrl ?? undefined,
```

near:

```ts
aiNotes: raw.aiNotes ?? [],
```

## 2. `app/reports/[id]/page.tsx`

Add import:

```ts
import { ReportScreenshotCard } from '@/components/reports/report-screenshot-card';
```

Then immediately after the opening `<AppShell ...>` tag, add:

```tsx
<ReportScreenshotCard screenshotUrl={report.screenshotUrl} site={report.site} />
```
