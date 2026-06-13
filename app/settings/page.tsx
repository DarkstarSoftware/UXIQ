import { redirect } from 'next/navigation';

import { BillingCard } from '@/components/billing/billing-card';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/settings');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, subscription_current_period_end')
    .eq('id', user.id)
    .single();

  return (
    <AppShell title="Settings" subtitle="Manage your account, preferences, billing, and integrations">
      <div className="app-grid-2">
        <section className="card app-section">
          <h2 className="section-title">Profile</h2>

          <div className="mt-5 grid gap-4">
            <label>
              <span className="mb-2 block text-sm font-medium text-white">Email</span>
              <input className="ai-input" value={user.email ?? ''} readOnly />
            </label>

            <label>
              <span className="mb-2 block text-sm font-medium text-white">Default audit settings</span>
              <select className="ai-input" defaultValue="deep">
                <option value="deep">Deep UX + WCAG recommended</option>
                <option value="basic">Basic scan</option>
              </select>
            </label>

            <Button>Save Changes</Button>
          </div>
        </section>

        <BillingCard
          plan={profile?.plan}
          status={profile?.subscription_status}
          periodEnd={profile?.subscription_current_period_end}
        />

        <section className="card app-section">
          <h2 className="section-title">Accessibility Defaults</h2>
          <div className="mt-5 grid gap-3">
            {['WCAG 2.2 AA checks', 'Keyboard and focus review', 'Contrast checks', 'Form label review'].map((item) => (
              <div key={item} className="issue-row">
                <span>{item}</span>
                <span className="badge badge-low">ON</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card app-section">
          <h2 className="section-title">API & Integrations</h2>
          <p className="mt-3 text-ui-muted">
            Stripe, Supabase, exports, and Figma integrations live here as the platform grows.
          </p>
          <div className="mt-5">
            <Button variant="secondary">Coming Soon</Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
