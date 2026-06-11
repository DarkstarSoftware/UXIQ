'use client';

import { useState } from 'react';
import type { AuditResult } from '@/lib/audit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DashboardView({ plan, auditsThisMonth }: { plan: 'free' | 'pro'; auditsThisMonth: number }) {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function runAudit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Audit failed');
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-ui-muted">Current plan</p><p className="mt-2 text-3xl font-semibold capitalize text-white">{plan}</p></div>
        <div className="card p-5"><p className="text-sm text-ui-muted">Audits this month</p><p className="mt-2 text-3xl font-semibold text-white">{auditsThisMonth}</p></div>
        <div className="card p-5"><p className="text-sm text-ui-muted">Report type</p><p className="mt-2 text-3xl font-semibold text-white">{plan === 'pro' ? 'AI' : 'Basic'}</p></div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-semibold text-white">Run a website audit</h2>
        <p className="mt-2 text-sm text-ui-muted">Free users receive basic Nielsen Norman + WCAG-aware insights. Pro users receive full AI analysis.</p>

        <form onSubmit={runAudit} className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com" required />
          <Button type="submit" disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Site'}</Button>
        </form>

        {error ? <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      </div>

      {report ? (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="card p-6">
            <p className="text-sm text-ui-muted">{report.normalizedUrl}</p>
            <p className="mt-4 text-7xl font-semibold text-white">{report.score}</p>
            <p className="mt-3 text-lg text-white">{report.summary}</p>
            <p className="mt-4 inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-sm text-brand-200">{report.plan === 'pro' ? 'Full AI report' : 'Basic free report'}</p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {(report.categories ?? []).map((category) => (
                <div key={category.name} className="card p-5">
                  <p className="text-sm text-ui-muted">{category.name}</p>
                  <p className="mt-2 text-4xl font-semibold text-white">{category.score}</p>
                  <p className="mt-2 text-sm text-ui-muted">{category.insight}</p>
                </div>
              ))}
            </div>

            <div className="card p-6">
              <h2 className="section-title">Top findings</h2>
              <div className="mt-5 space-y-3">
                {(report.issues ?? []).map((issue) => (
                  <div key={issue.title} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
                    <p className="text-sm font-medium text-white">[{issue.severity}] {issue.title}</p>
                    <p className="mt-2 text-sm text-ui-muted">{issue.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="section-title">Recommended fixes</h2>
              <div className="mt-5 space-y-3">
                {(report.fixes ?? []).map((fix) => (
                  <div key={fix.title} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
                    <p className="text-sm font-medium text-white">{fix.title}</p>
                    <p className="mt-2 text-xs text-ui-muted">Impact: {fix.impact} · Effort: {fix.effort}</p>
                    <p className="mt-2 text-sm text-ui-muted">{fix.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
