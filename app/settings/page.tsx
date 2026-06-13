import { redirect } from 'next/navigation';

import { BillingCard } from '@/components/billing/billing-card';
import { AppShell } from '@/components/layout/app-shell';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/settings');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, subscription_current_period_end, audits_this_month')
    .eq('id', user.id)
    .single();

  return (
    <AppShell title="Settings" subtitle="Manage your account, audit preferences, accessibility defaults, and billing">
      <div className="app-grid-2">
        <section className="card app-section">
          <h2 className="section-title">Account</h2>
          <p className="mt-3 text-ui-muted">{user.email}</p>

          <div className="mt-6 grid gap-4">
            {[
              ['WCAG-aware checks', 'Contrast, labels, alt text, focus states, keyboard-access concerns.'],
              ['Nielsen Norman references', 'Visibility, consistency, recognition, user control, and error prevention.'],
              ['Conversion analysis', 'CTA clarity, trust signals, form friction, and hierarchy.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-ui-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <BillingCard
          plan={profile?.plan}
          status={profile?.subscription_status}
          periodEnd={profile?.subscription_current_period_end}
        />
      </div>
    </AppShell>
  );
}
