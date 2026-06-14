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
      <BillingCard plan={profile?.plan} status={profile?.subscription_status} periodEnd={profile?.subscription_current_period_end} stripeCustomerId={profile?.stripe_customer_id} />

      <section className="card app-section">
        <h2 className="section-title">Plan Includes</h2>
        <div className="mt-5 app-grid-3">
          {[
            ['Real UX audits', 'Crawl websites and analyze structure, accessibility, and conversion hierarchy.'],
            ['Roadmaps', 'Turn audit findings into prioritized UX action plans.'],
            ['Competitors', 'Compare your site against competing experiences.'],
          ].map(([title, copy]) => (
            <div key={title} className="score-metric-card"><span>{title}</span><p className="mt-3 app-muted">{copy}</p></div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
