import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

const reports = [
  ['Nike.com', '72', 'Apr 18, 2026'],
  ['AcmeCorp.com', '58', 'Apr 13, 2026'],
  ['TechStartup.io', '83', 'Apr 5, 2026'],
  ['ShopFlow.com', '65', 'Mar 28, 2026'],
];

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/reports');

  return (
    <AppShell title="Reports" subtitle="View and manage your saved UX audit reports">
      <section className="card app-section">
        <div className="flex items-center justify-between gap-4">
          <h2 className="section-title">All Reports</h2>
          <Button>New Audit</Button>
        </div>

        <div className="report-list mt-5">
          {reports.map(([site, score, date]) => (
            <div key={site} className="report-row">
              <div>
                <p className="font-bold text-white">{site}</p>
                <p className="text-sm text-ui-muted">UX Score • {score}</p>
              </div>
              <p className="text-2xl font-black text-white">{score}</p>
              <p className="text-sm text-ui-muted">{date}</p>
              <Button variant="secondary">View Report</Button>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
