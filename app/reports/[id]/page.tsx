import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { ReportAiChat } from '@/components/reports/report-ai-chat';
import { UpgradeLock } from '@/components/reports/upgrade-lock';
import type { AuditResult } from '@/lib/audit';
import { normalizePlan } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/auth/login?redirect=/reports/${id}`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = normalizePlan(profile?.plan);

  const { data: reportRow } = await supabase
    .from('audit_reports')
    .select('id, normalized_url, score, summary, source, plan, report, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!reportRow) redirect('/reports');

  const report = reportRow.report as AuditResult;

  return (
    <AppShell title="Report Detail" subtitle="Review saved findings, recommendations, and next steps">
      <div className="mb-6">
        <Link href="/reports">
          <Button variant="secondary">Back to Reports</Button>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <p className="text-sm text-ui-muted">{reportRow.normalized_url}</p>
            <p className="mt-4 text-7xl font-semibold text-white">{reportRow.score}</p>
            <p className="mt-3 text-lg text-white">{reportRow.summary}</p>
            <p className="mt-4 inline-flex rounded-full border border-brand-500/40 bg-brand-500/10 px-3 py-1 text-sm text-brand-200">
              {reportRow.source === 'openai' ? 'Full AI Report' : 'Basic Report'}
            </p>
          </div>

          {plan === 'pro' ? <ReportAiChat reportId={reportRow.id} /> : <UpgradeLock />}
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
            <h2 className="section-title">Findings</h2>
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
            <h2 className="section-title">Fix Roadmap</h2>
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

          <div className="card p-6">
            <h2 className="section-title">Export Ready</h2>
            <p className="mt-2 text-sm text-ui-muted">
              This report layout is structured for future PDF export, client sharing, and agency reporting.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
