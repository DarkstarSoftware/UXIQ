import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/reports');

  return (
    <AppShell title="Reports" subtitle="Review saved UX audit reports">
      <section className="card app-section">
        <h2 className="section-title">Reports</h2>
        <p className="mt-3 text-ui-muted">Saved audit reports will appear here after you run audits.</p>
        <div className="mt-6">
          <Button variant="secondary">Coming Soon</Button>
        </div>
      </section>
    </AppShell>
  );
}
