import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { ExportButton } from '@/components/reports/export-button';
import { ExecutiveSummary } from '@/components/reports/executive-summary';
import { PriorityMatrix } from '@/components/reports/priority-matrix';
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/reports/${id}`);
  }

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

  if (!reportRow) {
    redirect('/reports');
  }

  const report = reportRow.report as AuditResult;

  return (
    <AppShell
      title="Report Detail"
      subtitle="Review saved findings, recommendations, and export-ready insights"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <Link href="/reports">
          <Button variant="secondary">Back to Reports</Button>
        </Link>

        {plan === 'pro' ? <ExportButton /> : <ExportButton disabled />}
      </div>

      <div className="space-y-6 print:bg-white print:text-black">
        <div className="card p-6 print:border print:border-gray-200 print:bg-white print:shadow-none">
          <p className="text-sm text-ui-muted print:text-gray-600">Darkstar Audit AI Report</p>
          <h2 className="mt-2 text-3xl font-semibold text-white print:text-black">
            {reportRow.normalized_url}
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-ui-muted print:text-gray-600">Score</p>
              <p className="text-6xl font-semibold text-white print:text-black">{reportRow.score}</p>
            </div>
            <div>
              <p className="text-sm text-ui-muted print:text-gray-600">Report Type</p>
              <p className="mt-2 text-lg capitalize text-white print:text-black">{reportRow.source}</p>
            </div>
            <div>
              <p className="text-sm text-ui-muted print:text-gray-600">Plan</p>
              <p className="mt-2 text-lg capitalize text-white print:text-black">{reportRow.plan}</p>
            </div>
          </div>
        </div>

        <ExecutiveSummary report={report} />

        {plan !== 'pro' ? (
          <div className="print:hidden">
            <UpgradeLock
              title="PDF export is a Pro feature"
              body="Upgrade to Pro to export polished reports, ask AI follow-up questions, and unlock deeper recommendations."
            />
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          {(report.categories ?? []).map((category) => (
            <div key={category.name} className="card p-5 print:border print:border-gray-200 print:bg-white print:shadow-none">
              <p className="text-sm text-ui-muted print:text-gray-600">{category.name}</p>
              <p className="mt-2 text-4xl font-semibold text-white print:text-black">{category.score}</p>
              <p className="mt-2 text-sm text-ui-muted print:text-gray-700">{category.insight}</p>
            </div>
          ))}
        </div>

        <div className="card p-6 print:border print:border-gray-200 print:bg-white print:shadow-none">
          <h2 className="section-title print:text-black">Findings</h2>
          <div className="mt-5 space-y-3">
            {(report.issues ?? []).map((issue) => (
              <div key={issue.title} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4 print:border-gray-200 print:bg-white">
                <p className="text-sm font-medium text-white print:text-black">
                  [{issue.severity}] {issue.title}
                </p>
                <p className="mt-2 text-sm text-ui-muted print:text-gray-700">{issue.body}</p>
              </div>
            ))}
          </div>
        </div>

        <PriorityMatrix fixes={report.fixes ?? []} />

        {plan === 'pro' ? (
          <div className="print:hidden">
            <ReportAiChat reportId={reportRow.id} />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
