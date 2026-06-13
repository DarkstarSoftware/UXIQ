import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

const roadmapItems = [
 ['Increase CTA contrast','Update primary CTA color, hover state, and button hierarchy to improve accessibility and click clarity.','Low Effort'],
 ['Clarify above-the-fold action','Rewrite hero CTA and reduce competing actions so users know the next step immediately.','Medium Effort'],
 ['Improve form accessibility','Add persistent labels, better errors, helper text, and keyboard-friendly focus states.','Medium Effort'],
 ['Simplify report navigation','Group insights by severity and add clearer paths to recommended fixes.','High Effort'],
];

export default async function RoadmapsPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/roadmaps');
  return (
    <AppShell title="Roadmaps" subtitle="Turn UX audit findings into prioritized action plans" actions={<Button>Generate Roadmap</Button>}>
      <section className="card app-section">
        <div className="app-toolbar"><div><p className="app-kicker">AI Roadmap</p><h2 className="section-title">Prioritized UX improvements</h2></div><Button variant="secondary">Export Plan</Button></div>
        <div className="roadmap-list">{roadmapItems.map(([title, copy, effort], index)=><article key={title} className="roadmap-item"><span className="roadmap-index">{index+1}</span><div><h3 className="m-0 text-lg font-semibold text-white">{title}</h3><p className="mt-2 app-muted">{copy}</p></div><span className={effort==='Low Effort'?'badge badge-low':effort==='Medium Effort'?'badge badge-med':'badge badge-high'}>{effort}</span></article>)}</div>
      </section>
    </AppShell>
  );
}
