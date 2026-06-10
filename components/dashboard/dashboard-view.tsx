'use client';

import { useState } from 'react';
import type { AuditResult, CategoryScore, Fix, Issue, Plan } from '@/lib/audit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const defaultCategories: CategoryScore[] = [
  { name: 'Usability', score: 0, insight: 'Run an audit to view usability findings.' },
  { name: 'Accessibility', score: 0, insight: 'Run an audit to view WCAG-focused findings.' },
  { name: 'Conversion', score: 0, insight: 'Run an audit to view conversion blockers.' },
  { name: 'Visual Design', score: 0, insight: 'Run an audit to view visual consistency insights.' },
];

function SeverityBadge({ severity }: { severity: Issue['severity'] | Fix['impact'] }) {
  const classes = severity === 'High' ? 'bg-danger/15 text-red-300' : severity === 'Medium' ? 'bg-warning/15 text-yellow-300' : 'bg-white/10 text-ui-muted';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>{severity}</span>;
}

function PlanBadge({ plan }: { plan: Plan }) {
  return <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-300">{plan === 'free' ? 'Free basic audit' : 'AI-powered full audit'}</span>;
}

export function DashboardView({ initialPlan }: { initialPlan: Plan }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditResult | null>(null);

  async function runAudit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Audit failed.');
      setReport(data as AuditResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const categories = report?.categories?.length ? report.categories : defaultCategories;
  const issues = report?.issues ?? [];
  const fixes = report?.fixes ?? [];
  const score = report?.score ?? 0;
  const plan = report?.plan ?? initialPlan;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <PlanBadge plan={plan} />
            <h2 className="mt-4 text-2xl font-semibold text-white">Analyze a website</h2>
            <p className="mt-2 max-w-2xl text-sm text-ui-muted">
              Free users receive a basic rule-based review referencing Nielsen Norman usability principles and WCAG-aware checks. Paid users receive full AI-generated analysis with deeper issues, fixes, and business impact.
            </p>
          </div>
        </div>
        <form onSubmit={runAudit} className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter website URL, e.g. https://example.com" required />
          <Button type="submit" disabled={loading}>{loading ? 'Analyzing…' : 'Run Audit'}</Button>
        </form>
        {error && <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-red-300">{error}</p>}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="card p-6">
          <p className="text-sm text-ui-muted">Overall UX score</p>
          <p className="mt-4 text-7xl font-semibold tracking-tight text-white">{score}</p>
          <p className="mt-3 text-xl text-white">{report?.summary || 'Run your first audit to generate a score.'}</p>
          <p className="mt-4 text-sm text-ui-muted">{report?.normalizedUrl || 'No website analyzed yet.'}</p>
          {report?.note && <p className="mt-4 rounded-xl bg-warning/10 p-3 text-sm text-yellow-300">{report.note}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category.name} className="card p-5">
              <div className="flex items-center justify-between">
                <p className="font-medium text-white">{category.name}</p>
                <p className="text-2xl font-semibold text-white">{category.score}</p>
              </div>
              <p className="mt-3 text-sm text-ui-muted">{category.insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <h2 className="section-title">Top issues</h2>
          <div className="mt-5 space-y-4">
            {issues.length ? issues.map((issue) => (
              <div key={issue.title} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-medium text-white">{issue.title}</p><SeverityBadge severity={issue.severity} /></div>
                <p className="mt-2 text-sm text-ui-muted">{issue.body}</p>
              </div>
            )) : <p className="text-sm text-ui-muted">Audit findings will appear here.</p>}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="section-title">Recommended fixes</h2>
          <div className="mt-5 space-y-4">
            {fixes.length ? fixes.map((fix) => (
              <div key={fix.title} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
                <div className="flex items-center justify-between gap-3"><p className="font-medium text-white">{fix.title}</p><SeverityBadge severity={fix.impact} /></div>
                <p className="mt-2 text-sm text-ui-muted">{fix.description}</p>
                <p className="mt-3 text-xs text-ui-muted">Effort: {fix.effort}</p>
              </div>
            )) : <p className="text-sm text-ui-muted">Recommended fixes will appear here.</p>}
          </div>
        </div>
      </div>

      {report?.locked && (
        <div className="card border-brand-500/40 bg-brand-500/10 p-6">
          <h2 className="text-xl font-semibold text-white">{report.locked.title}</h2>
          <p className="mt-3 text-sm text-ui-muted">{report.locked.body}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {report.locked.features.map((feature) => <div key={feature} className="rounded-xl border border-brand-500/20 bg-ui-surface/60 p-4 text-sm text-white">{feature}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
