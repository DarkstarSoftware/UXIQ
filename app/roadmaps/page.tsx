import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { normalizePlan } from '@/lib/plan';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

export default async function RoadmapsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/roadmaps');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (normalizePlan(profile?.plan) !== 'pro') {
    return (
      <AppShell title="Roadmaps" subtitle="Turn audits into prioritized action plans">
        <div className="card p-8">
          <h2 className="section-title">AI Roadmaps are a Pro feature</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ui-muted">
            Upgrade to Pro to turn saved audits into stakeholder-ready UX, accessibility, and conversion roadmaps.
          </p>
          <form action="/api/stripe/checkout" method="POST">
            <Button className="mt-6">Upgrade to Pro</Button>
          </form>
        </div>
      </AppShell>
    );
  }

  const { data: roadmaps } = await supabase
    .from('roadmaps')
    .select('id, title, summary, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <AppShell title="Roadmaps" subtitle="Prioritized UX, WCAG, and conversion action plans">
      <div className="card p-6">
        <h2 className="section-title">Generated Roadmaps</h2>

        <div className="mt-6 space-y-3">
          {(roadmaps ?? []).length === 0 ? (
            <p className="text-sm text-ui-muted">
              No roadmaps yet. Open a saved report and generate an AI roadmap.
            </p>
          ) : (
            roadmaps?.map((roadmap) => (
              <div
                key={roadmap.id}
                className="grid gap-4 rounded-xl border border-ui-border bg-ui-surface/60 p-4 md:grid-cols-[1fr_auto_auto]"
              >
                <div>
                  <p className="font-medium text-white">{roadmap.title}</p>
                  <p className="mt-1 text-sm text-ui-muted">{roadmap.summary}</p>
                </div>
                <p className="text-sm text-ui-muted">{formatDate(roadmap.created_at)}</p>
                <Link href={`/roadmaps/${roadmap.id}`}>
                  <Button variant="secondary">Open</Button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
