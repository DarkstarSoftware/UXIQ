import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/roadmaps');

  return (
    <AppShell title="Roadmaps" subtitle="Turn audits into prioritized action plans">
      <section className="card app-section">
        <h2 className="section-title">Roadmaps</h2>
        <p className="mt-3 text-ui-muted">AI roadmaps will appear here after generating them from saved reports.</p>
        <div className="mt-6">
          <Button variant="secondary">Coming Soon</Button>
        </div>
      </section>
    </AppShell>
  );
}
