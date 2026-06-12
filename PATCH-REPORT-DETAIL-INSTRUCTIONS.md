# Add Roadmap Callout to Report Detail

Open:

app/reports/[id]/page.tsx

Add import:

```tsx
import { RoadmapCallout } from '@/components/reports/roadmap-callout';
```

Then add this in the report detail page, ideally near the AI chat/export section:

```tsx
{plan === 'pro' ? <RoadmapCallout reportId={reportRow.id} /> : null}
```

This keeps Phase 8 additive without forcing a full report page overwrite.
