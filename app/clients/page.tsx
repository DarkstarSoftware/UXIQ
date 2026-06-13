import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/clients');

  return (
    <AppShell title="Clients" subtitle="Manage agency client profiles">
      <section className="card app-section">
        <h2 className="section-title">Clients</h2>
        <p className="mt-3 text-ui-muted">Client records will appear here for agency and white-label workflows.</p>
        <div className="mt-6">
          <Button variant="secondary">Coming Soon</Button>
        </div>
      </section>
    </AppShell>
  );
}
