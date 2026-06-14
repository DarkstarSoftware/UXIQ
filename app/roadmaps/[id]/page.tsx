import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Download } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { dbRoadmapToView, type RoadmapItem } from '@/lib/roadmap-engine';

function PhaseSection({ title, items }: { title: string; items: RoadmapItem[] }) {
  return (
    <section className="card app-section">
      <div className="app-toolbar">
        <div><p className="app-kicker">{title}</p><h2 className="section-title">{items.length} prioritized item{items.length === 1 ? '' : 's'}</h2></div>
      </div>

      {items.length === 0 ? (
        <p className="app-muted">No items in this phase.</p>
      ) : (
        <div className="roadmap-list">
          {items.map((item) => (
            <article key={`${item.priority}-${item.title}`} className="roadmap-item">
              <span className="roadmap-index">{item.priority}</span>
              <div>
                <h3 className="m-0 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 app-muted">{item.description}</p>
                <p className="mt-3 app-muted"><strong>Source issue:</strong> {item.sourceIssue}</p>
                <p className="mt-2 app-muted"><strong>Success metric:</strong> {item.successMetric}</p>
              </div>
              <div className="grid gap-2">
                <span className="badge badge-pro">{item.category}</span>
                <span className={item.impact === 'High' ? 'badge badge-high' : item.impact === 'Medium' ? 'badge badge-med' : 'badge badge-low'}>{item.impact} Impact</span>
                <span className={item.effort === 'Low' ? 'badge badge-low' : item.effort === 'Medium' ? 'badge badge-med' : 'badge badge-high'}>{item.effort} Effort</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function RoadmapDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) redirect(`/auth/login?redirect=/roadmaps/${id}`);

  const { data } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) redirect('/roadmaps');

  const roadmap = dbRoadmapToView(data);

  return (
    <AppShell
      title={roadmap.title}
      subtitle={roadmap.summary}
      actions={
        <div className="app-toolbar-actions">
          {roadmap.auditReportId ? <Link href={`/reports/${roadmap.auditReportId}`}><Button variant="secondary">View Source Report</Button></Link> : null}
          <Button variant="secondary"><Download className="h-4 w-4" /> Export Plan</Button>
        </div>
      }
    >
      <section className="card app-section">
        <div className="app-grid-3">
          <div className="score-metric-card"><span>Total Items</span><strong>{roadmap.items.length}</strong></div>
          <div className="score-metric-card"><span>Quick Wins</span><strong>{roadmap.quickWins.length}</strong></div>
          <div className="score-metric-card"><span>Strategic Items</span><strong>{roadmap.strategicInitiatives.length}</strong></div>
        </div>
      </section>

      <PhaseSection title="Quick Wins" items={roadmap.quickWins} />
      <PhaseSection title="Next Phase" items={roadmap.nextPhase} />
      <PhaseSection title="Strategic Initiatives" items={roadmap.strategicInitiatives} />
    </AppShell>
  );
}
