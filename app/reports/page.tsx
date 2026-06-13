import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

const reports = [
  ['Nike.com', 'www.nike.com', '72', 'Apr 18, 2026', 'Needs CTA contrast work'],
  ['AcmeCorp.com', 'www.acmecorp.com', '58', 'Apr 13, 2026', 'Accessibility risk detected'],
  ['TechStartup.io', 'www.techstartup.io', '83', 'Apr 5, 2026', 'Strong UX foundation'],
  ['ShopFlow.com', 'www.shopflow.com', '65', 'Mar 28, 2026', 'Checkout friction found'],
];

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/reports');

  return (
    <AppShell title="Reports" subtitle="View and manage your saved UX audit reports" actions={<Button>New Audit</Button>}>
      <section className="card app-section">
        <div className="app-toolbar">
          <div><p className="app-kicker">All reports</p><h2 className="section-title">Saved UX Audits</h2></div>
          <div className="app-toolbar-actions"><input className="ai-input" placeholder="Search reports" aria-label="Search reports" /><select className="ai-input" aria-label="Filter by score"><option>All Scores</option><option>80+</option><option>60–79</option><option>Below 60</option></select></div>
        </div>
        <div className="report-list">
          {reports.map(([site, url, score, date, note]) => (
            <div key={site} className="report-row">
              <div><p className="report-title">{site}</p><p className="report-url">{url}</p><p className="mt-2 app-muted">{note}</p></div>
              <div><span className="score-chip">{score}</span></div>
              <div><p className="app-muted">{date}</p></div>
              <Button variant="secondary">View Report</Button>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
