import type { Fix } from '@/lib/audit';

export function PriorityMatrix({ fixes }: { fixes: Fix[] }) {
  return (
    <div className="card p-6">
      <h2 className="section-title">Priority Matrix</h2>
      <p className="mt-2 text-sm text-ui-muted">
        Recommended fixes ranked by business impact and implementation effort.
      </p>

      <div className="mt-5 space-y-3">
        {fixes.length === 0 ? (
          <p className="text-sm text-ui-muted">No fixes available for this report.</p>
        ) : (
          fixes.map((fix) => (
            <div
              key={fix.title}
              className="grid gap-4 rounded-xl border border-ui-border bg-ui-surface/60 p-4 md:grid-cols-[1fr_auto_auto]"
            >
              <div>
                <p className="font-medium text-white">{fix.title}</p>
                <p className="mt-1 text-sm text-ui-muted">{fix.description}</p>
              </div>

              <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
                Impact: {fix.impact}
              </span>

              <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs text-warning">
                Effort: {fix.effort}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
