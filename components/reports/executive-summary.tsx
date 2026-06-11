import type { AuditResult } from '@/lib/audit';

export function ExecutiveSummary({ report }: { report: AuditResult }) {
  const highIssues = report.issues?.filter((issue) => issue.severity === 'High').length ?? 0;
  const mediumIssues = report.issues?.filter((issue) => issue.severity === 'Medium').length ?? 0;

  return (
    <div className="card p-6">
      <h2 className="section-title">Executive Summary</h2>

      <p className="mt-3 text-sm leading-6 text-ui-muted">
        Darkstar Audit AI reviewed this website for usability, accessibility, WCAG-aware concerns,
        visual consistency, and conversion friction. The current score is{' '}
        <span className="font-semibold text-white">{report.score}</span>.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="text-sm text-ui-muted">Overall Score</p>
          <p className="mt-2 text-4xl font-semibold text-white">{report.score}</p>
        </div>

        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="text-sm text-ui-muted">High Priority Issues</p>
          <p className="mt-2 text-4xl font-semibold text-white">{highIssues}</p>
        </div>

        <div className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
          <p className="text-sm text-ui-muted">Medium Priority Issues</p>
          <p className="mt-2 text-4xl font-semibold text-white">{mediumIssues}</p>
        </div>
      </div>
    </div>
  );
}
