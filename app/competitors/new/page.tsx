import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function NewComparisonPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/competitors/new');

  return (
    <AppShell title="Add Comparison" subtitle="Compare your site against competing experiences">
      <section className="card app-section">
        <form action="/api/competitors/compare" method="POST" className="form-grid">
          <label><span className="form-label">Your website</span><input className="ai-input" name="primaryUrl" placeholder="https://yourwebsite.com" required /></label>
          <label><span className="form-label">Competitor 1</span><input className="ai-input" name="competitorOne" placeholder="https://competitor.com" required /></label>
          <label><span className="form-label">Competitor 2</span><input className="ai-input" name="competitorTwo" placeholder="https://anothercompetitor.com" /></label>
          <label><span className="form-label">Competitor 3</span><input className="ai-input" name="competitorThree" placeholder="https://thirdcompetitor.com" /></label>
          <Button type="submit">Compare Sites</Button>
        </form>
      </section>
    </AppShell>
  );
}
