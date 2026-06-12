export function AgencyReportNote() {
  return (
    <div className="card p-6">
      <h2 className="section-title">Agency Delivery Notes</h2>
      <p className="mt-2 text-sm leading-6 text-ui-muted">
        This report is structured for client delivery. Use the executive summary, priority matrix,
        accessibility findings, and conversion recommendations to guide stakeholder conversations.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="font-medium text-white">Client Impact</p>
          <p className="mt-2 text-sm text-ui-muted">
            Connect UX issues to leads, sales, trust, and customer confidence.
          </p>
        </div>

        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="font-medium text-white">Accessibility Risk</p>
          <p className="mt-2 text-sm text-ui-muted">
            Highlight WCAG-aware barriers that may prevent users from completing tasks.
          </p>
        </div>

        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="font-medium text-white">Fix Roadmap</p>
          <p className="mt-2 text-sm text-ui-muted">
            Prioritize improvements by expected impact and effort.
          </p>
        </div>
      </div>
    </div>
  );
}
