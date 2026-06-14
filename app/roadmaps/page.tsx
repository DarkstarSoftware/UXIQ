import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Map } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { dbRoadmapToView } from '@/lib/roadmap-engine';

export default async function RoadmapsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/roadmaps');

  const { data } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const roadmaps = data?.map(dbRoadmapToView) ?? [];

  return (
    <AppShell title="Roadmaps" subtitle="Saved UX roadmaps generated from your audit reports" actions={<Link href="/reports"><Button>Generate from Report</Button></Link>}>
      {roadmaps.length === 0 ? (
        <section className="card app-section">
          <Map className="h-10 w-10 text-brand-300" aria-hidden="true" />
          <h2 className="mt-5 section-title">No roadmaps yet</h2>
          <p className="mt-3 app-muted">Open a saved report and click Generate Roadmap to create a prioritized UX action plan.</p>
          <div className="mt-6"><Link href="/reports"><Button>Go to Reports</Button></Link></div>
        </section>
      ) : (
        <section className="card app-section">
          <div className="app-toolbar">
            <div><p className="app-kicker">Saved roadmaps</p><h2 className="section-title">Prioritized UX Action Plans</h2></div>
          </div>
          <div className="report-list">
            {roadmaps.map((roadmap) => (
              <div key={roadmap.id} className="report-row">
                <div>
                  <p className="report-title">{roadmap.title}</p>
                  <p className="report-url">{roadmap.url}</p>
                  <p className="mt-2 app-muted">{roadmap.summary}</p>
                </div>
                <div><span className="score-chip">{roadmap.items.length}</span></div>
                <div><p className="app-muted">{new Date(roadmap.createdAt).toLocaleDateString()}</p></div>
                <Link href={`/roadmaps/${roadmap.id}`}><Button variant="secondary">View Roadmap</Button></Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
