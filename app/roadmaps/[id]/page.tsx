import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import type { RoadmapResult } from '@/lib/roadmap';
import { createClient } from '@/lib/supabase/server';

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/roadmaps/${id}`);
  }

  const { data: roadmapRow } = await supabase
    .from('roadmaps')
    .select('id, title, summary, roadmap, created_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!roadmapRow) {
    redirect('/roadmaps');
  }

  const roadmap = roadmapRow.roadmap as RoadmapResult;

  return (
    <AppShell title="Roadmap Detail" subtitle="A prioritized action plan based on your audit">
      <div className="space-y-6">
        <div className="card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-300">
            Darkstar Roadmap
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white">{roadmap.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-ui-muted">
            {roadmap.summary}
          </p>
        </div>

        <div className="grid gap-6">
          {roadmap.phases?.map((phase) => (
            <div key={phase.name} className="card p-6">
              <h2 className="section-title">{phase.name}</h2>
              <p className="mt-2 text-sm text-ui-muted">{phase.goal}</p>

              <div className="mt-5 space-y-3">
                {phase.tasks?.map((task) => (
                  <div
                    key={task.title}
                    className="rounded-xl border border-ui-border bg-ui-surface/60 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-medium text-white">{task.title}</p>
                        <p className="mt-2 text-sm leading-6 text-ui-muted">{task.why}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-success">
                          Impact: {task.impact}
                        </span>
                        <span className="rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-warning">
                          Effort: {task.effort}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm text-ui-muted md:grid-cols-2">
                      <p>Owner: {task.owner}</p>
                      <p>Timeframe: {task.timeframe}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="section-title">Executive Notes</h2>
          <ul className="mt-4 space-y-2 text-sm text-ui-muted">
            {roadmap.executiveNotes?.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
