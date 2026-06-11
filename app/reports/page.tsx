import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/reports');

  const { data: reports } = await supabase
    .from('audit_reports')
    .select('id, normalized_url, score, summary, source, plan, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <AppShell title="Reports" subtitle="Review saved audits and historical website scores">
      <div className="card p-6">
        <h2 className="section-title">Audit History</h2>

        <div className="mt-6 space-y-3">
          {(reports ?? []).length === 0 ? (
            <p className="text-sm text-ui-muted">No reports yet. Run your first audit from the dashboard.</p>
          ) : (
            reports?.map((report) => (
              <div
                key={report.id}
                className="grid gap-4 rounded-xl border border-ui-border bg-ui-surface/60 p-4 md:grid-cols-[1fr_auto_auto_auto_auto]"
              >
                <div>
                  <p className="font-medium text-white">{report.normalized_url}</p>
                  <p className="mt-1 text-sm text-ui-muted">{report.summary}</p>
                </div>
                <p className="text-3xl font-semibold text-white">{report.score}</p>
                <p className="text-sm capitalize text-ui-muted">{report.plan}</p>
                <p className="text-sm text-ui-muted">{formatDate(report.created_at)}</p>
                <Link href={`/reports/${report.id}`}>
                  <Button variant="secondary">Open</Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
