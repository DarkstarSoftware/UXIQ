import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/competitors');

  return (
    <AppShell title="Competitors" subtitle="Compare your UX performance against the market">
      <section className="card app-section">
        <h2 className="section-title">Competitors</h2>
        <p className="mt-3 text-ui-muted">Competitor analysis is a Pro feature. Use it to benchmark UX, accessibility, and conversion opportunities.</p>
        <div className="mt-6">
          <Button variant="secondary">Coming Soon</Button>
        </div>
      </section>
    </AppShell>
  );
}
