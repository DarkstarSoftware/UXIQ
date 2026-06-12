import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { BillingCard } from '@/components/billing/billing-card';
import { createClient } from '@/lib/supabase/server';

function Toggle({ enabled }: { enabled?: boolean }) {
  return (
    <div className={`flex h-6 w-11 items-center rounded-full p-1 ${enabled ? 'bg-brand-500' : 'bg-ui-border'}`}>
      <div className={`h-4 w-4 rounded-full bg-white transition ${enabled ? 'translate-x-5' : ''}`} />
    </div>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/settings');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, audits_this_month, subscription_status, subscription_current_period_end')
    .eq('id', user.id)
    .single();

  return (
    <AppShell
      title="Settings"
      subtitle="Manage audit preferences, accessibility standards, and billing"
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="section-title">Account</h2>
            <p className="mt-2 text-sm text-ui-muted">{user.email}</p>
          </div>

          <div className="card p-6">
            <h2 className="section-title">Audit Preferences</h2>

            <div className="mt-5 space-y-4">
              {[
                ['Include WCAG accessibility checks', 'Evaluate contrast, labels, alt text, heading structure, and keyboard-access concerns.'],
                ['Reference Nielsen Norman heuristics', 'Review visibility, consistency, error prevention, recognition, and user control.'],
                ['Include conversion friction analysis', 'Identify weak CTAs, form friction, trust gaps, and unclear hierarchy.'],
              ].map(([label, description]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 rounded-xl border border-ui-border bg-ui-surface/60 px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="mt-1 text-sm text-ui-muted">{description}</p>
                  </div>
                  <Toggle enabled />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BillingCard
            plan={profile?.plan}
            status={profile?.subscription_status}
            periodEnd={profile?.subscription_current_period_end}
          />

          <div className="card p-6">
            <h2 className="section-title">Usage</h2>
            <div className="mt-5 rounded-xl border border-ui-border bg-ui-surface/60 p-5">
              <p className="text-sm text-ui-muted">Audits This Month</p>
              <p className="mt-2 text-5xl font-semibold text-white">
                {profile?.audits_this_month ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
