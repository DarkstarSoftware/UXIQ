import { redirect } from 'next/navigation';

import { BillingCard } from '@/components/billing/billing-card';
import { AppShell } from '@/components/layout/app-shell';
import { createClient } from '@/lib/supabase/server';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/billing');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, subscription_current_period_end, stripe_customer_id')
    .eq('id', user.id)
    .single();

  return (
    <AppShell title="Billing" subtitle="Manage your AIUX Insight subscription and plan access">
      <BillingCard
        plan={profile?.plan}
        status={profile?.subscription_status}
        periodEnd={profile?.subscription_current_period_end}
        stripeCustomerId={profile?.stripe_customer_id}
      />

      <section className="card app-section premium-includes-section">
        <div className="premium-section-heading">
          <p className="app-kicker">Plan Includes</p>
          <h2 className="section-title">Everything needed to turn UX issues into action.</h2>
          <p className="app-muted">
            Use AIUX Insight to find issues, prioritize work, benchmark competitors, and create client-ready deliverables.
          </p>
        </div>

        <div className="premium-includes-grid">
          <div className="premium-include-card">
            <h3>Real UX audits</h3>
            <p>Crawl websites and analyze structure, accessibility, usability, and conversion hierarchy.</p>
          </div>

          <div className="premium-include-card">
            <h3>Roadmaps</h3>
            <p>Turn audit findings into prioritized UX action plans your team can actually execute.</p>
          </div>

          <div className="premium-include-card">
            <h3>Competitors</h3>
            <p>Compare your site against competing experiences to identify gaps and opportunities.</p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
