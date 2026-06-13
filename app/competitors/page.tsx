import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

const competitors = [['Your Site','nike.com','72','Good, room to improve'],['Competitor 1','adidas.com','79','Better UX in some areas'],['Competitor 2','underarmour.com','63','Friction issues detected']];
const opportunities = [['Strengthen CTA visibility','Your primary actions need stronger contrast and hierarchy.','High Impact'],['Improve accessibility compliance','Competitors show clearer form labels and focus behavior.','High Impact'],['Simplify navigation','Reduce competing choices and improve wayfinding.','Medium Impact']];

export default async function CompetitorsPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/competitors');
  return (
    <AppShell title="Competitors" subtitle="Compare your UX performance against competitors and find opportunities to win" actions={<Button>Add Comparison</Button>}>
      <section className="card app-section">
        <div className="app-toolbar"><div><p className="app-kicker">Comparison Set</p><h2 className="section-title">Your site vs competitors</h2></div><Button variant="secondary">Export PDF</Button></div>
        <div className="comparison-grid">{competitors.map(([label, site, score, note], index) => <article key={site} className="comparison-card"><span className="comparison-rank">{index+1}</span><p className="mt-5 app-kicker">{label}</p><h3 className="mt-2 text-xl font-semibold text-white">{site}</h3><p className="comparison-score">{score}</p><p className="app-muted">{note}</p></article>)}</div>
      </section>
      <section className="card app-section"><h2 className="section-title">Top Opportunities</h2><div className="mt-5 grid gap-3">{opportunities.map(([title, copy, impact], index)=><div key={title} className="issue-row"><div className="issue-row-main"><span className="roadmap-index">{index+1}</span><div><p className="issue-row-title">{title}</p><p className="issue-row-copy">{copy}</p></div></div><span className={impact==='High Impact'?'badge badge-high':'badge badge-med'}>{impact}</span></div>)}</div></section>
    </AppShell>
  );
}
