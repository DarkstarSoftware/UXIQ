import { AppShell } from '@/components/layout/app-shell';
import { reports } from '@/lib/mock-data';

export default function ReportsPage() {
  return (
    <AppShell title="Reports" subtitle="Review saved audits and track UX improvement over time">
      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1.2fr_.5fr_.8fr_.8fr] border-b border-ui-border px-6 py-4 text-sm font-semibold text-ui-muted">
          <span>Website</span><span>Score</span><span>Date</span><span>Status</span>
        </div>
        {reports.map((report) => (
          <div key={report.site} className="grid grid-cols-[1.2fr_.5fr_.8fr_.8fr] border-b border-ui-border/60 px-6 py-5 text-sm last:border-0">
            <span className="font-medium text-white">{report.site}</span>
            <span className="text-white">{report.score}</span>
            <span className="text-ui-muted">{report.date}</span>
            <span className="text-ui-muted">{report.status}</span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
