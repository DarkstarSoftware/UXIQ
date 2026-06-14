import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { dbReportToAuditReport } from '@/lib/audit-engine';

export default async function RoadmapsPage({ searchParams }: { searchParams: Promise<{ report?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/roadmaps');

  const query = await searchParams;
  const { data } = query.report
    ? await supabase.from('audit_reports').select('*').eq('id', query.report).eq('user_id', user.id).single()
    : { data: null };

  if (!data) redirect('/reports');

  const report = dbReportToAuditReport(data);
  const roadmapItems = report.issues.map((issue, index) => ({
    title: issue.recommendation,
    copy: `Based on: ${issue.title}. ${issue.detail}`,
    effort: issue.effort,
    impact: issue.impact,
    category: issue.category,
    index: index + 1,
  }));

  return (
    <AppShell title="Roadmaps" subtitle={`Prioritized action plan for ${report.site}`} actions={<Link href={`/reports/${report.id}`}><Button variant="secondary">View Source Report</Button></Link>}>
      <section className="card app-section">
        <div className="app-toolbar"><div><p className="app-kicker">Generated Roadmap</p><h2 className="section-title">Prioritized UX improvements</h2></div><Button variant="secondary">Export Plan</Button></div>
        <div className="roadmap-list">
          {roadmapItems.map((item) => (
            <article key={item.title} className="roadmap-item">
              <span className="roadmap-index">{item.index}</span>
              <div><h3 className="m-0 text-lg font-semibold text-white">{item.title}</h3><p className="mt-2 app-muted">{item.copy}</p></div>
              <div className="grid gap-2"><span className="badge badge-pro">{item.category}</span><span className={item.impact === 'High' ? 'badge badge-high' : item.impact === 'Medium' ? 'badge badge-med' : 'badge badge-low'}>{item.impact} Impact</span><span className={item.effort === 'Low' ? 'badge badge-low' : item.effort === 'Medium' ? 'badge badge-med' : 'badge badge-high'}>{item.effort} Effort</span></div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
