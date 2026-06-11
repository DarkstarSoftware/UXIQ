export function ClientNotes() {
  return (
    <div className="card p-6">
      <h2 className="section-title">Client-Ready Notes</h2>
      <p className="mt-2 text-sm leading-6 text-ui-muted">
        Use this section to summarize what matters most to stakeholders: the score,
        high-priority issues, conversion friction, accessibility concerns, and the recommended
        order of fixes. This supports future agency workflows and white-label reporting.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="text-sm font-medium text-white">Business Impact</p>
          <p className="mt-2 text-sm text-ui-muted">
            Tie UX issues to leads, sales, trust, and user confidence.
          </p>
        </div>

        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="text-sm font-medium text-white">Accessibility Risk</p>
          <p className="mt-2 text-sm text-ui-muted">
            Highlight WCAG-aware concerns that may block users.
          </p>
        </div>

        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="text-sm font-medium text-white">Next Actions</p>
          <p className="mt-2 text-sm text-ui-muted">
            Prioritize fixes by effort and expected impact.
          </p>
        </div>
      </div>
    </div>
  );
}
