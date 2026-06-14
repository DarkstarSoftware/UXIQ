import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { dbReportToAuditReport } from '@/lib/audit-engine';
import { demoReports } from '@/lib/demo-data';

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/reports');

  const { data } = await supabase
    .from('audit_reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const reports = data?.length ? data.map(dbReportToAuditReport) : demoReports;

  return (
    <AppShell title="Reports" subtitle="View and manage your saved UX audit reports" actions={<Link href="/dashboard"><Button>New Audit</Button></Link>}>
      <section className="card app-section">
        <div className="app-toolbar">
          <div><p className="app-kicker">All reports</p><h2 className="section-title">Saved UX Audits</h2></div>
          <div className="app-toolbar-actions"><input className="ai-input" placeholder="Search reports" aria-label="Search reports" /><select className="ai-input" aria-label="Filter by score"><option>All Scores</option><option>80+</option><option>60–79</option><option>Below 60</option></select></div>
        </div>

        <div className="report-list">
          {reports.map((report) => (
            <div key={report.id} className="report-row">
              <div>
                <p className="report-title">{report.site}</p>
                <p className="report-url">{report.url}</p>
                <p className="mt-2 app-muted">{report.summary}</p>
                <div className="mt-3 flex gap-2">
                  <span className={report.auditMode === 'pro' ? 'badge badge-pro' : 'badge badge-low'}>{report.auditMode === 'pro' ? 'AI + WCAG + Heuristics' : 'WCAG + Heuristics'}</span>
                </div>
              </div>
              <div><span className="score-chip">{report.score}</span></div>
              <div><p className="app-muted">{report.date}</p></div>
              <Link href={`/reports/${report.id}`}><Button variant="secondary">View Report</Button></Link>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
