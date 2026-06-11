import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { CompetitorForm } from '@/components/competitors/competitor-form';
import { normalizePlan } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

export default async function CompetitorsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/competitors');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = normalizePlan(profile?.plan);

  return (
    <AppShell
      title="Competitors"
      subtitle="Compare your UX performance against the market"
    >
      {plan === 'pro' ? (
        <CompetitorForm />
      ) : (
        <div className="card p-8">
          <h2 className="section-title">Competitor analysis is a Pro feature</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ui-muted">
            Upgrade to compare your website against competitors and uncover market-level
            UX, accessibility, and conversion opportunities.
          </p>
          <form action="/api/stripe/checkout" method="POST">
            <Button className="mt-6">Upgrade to Pro</Button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
