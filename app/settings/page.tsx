import { redirect } from 'next/navigation';
import { Bell, FileText, ShieldCheck, UserCircle } from 'lucide-react';

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
    .select('plan, subscription_status, subscription_current_period_end, stripe_customer_id, full_name, company_name, role')
    .eq('id', user.id)
    .single();

  return (
    <AppShell title="Settings" subtitle="Manage your profile, subscription, audit defaults, and report preferences">
      <div className="settings-grid">
        <div className="settings-stack">
          <section className="card app-section">
            <div className="app-toolbar">
              <div><p className="app-kicker">Profile</p><h2 className="section-title">Account Details</h2></div>
              <UserCircle className="h-9 w-9 text-brand-300" />
            </div>

            <div className="mt-5 form-grid">
              <div className="profile-settings-row">
                <div className="profile-avatar xl">{user.email?.slice(0, 1).toUpperCase() || 'U'}</div>
                <div>
                  <p className="issue-row-title">Profile photo</p>
                  <p className="issue-row-copy">Avatar upload will be available soon.</p>
                </div>
              </div>

              <label><span className="form-label">Full name</span><input className="ai-input" defaultValue={profile?.full_name ?? ''} placeholder="Todd Fleury" /></label>
              <label><span className="form-label">Email</span><input className="ai-input" value={user.email ?? ''} readOnly /></label>
              <label><span className="form-label">Company</span><input className="ai-input" defaultValue={profile?.company_name ?? ''} placeholder="AIUX Insight" /></label>
              <label><span className="form-label">Role</span><input className="ai-input" defaultValue={profile?.role ?? ''} placeholder="Founder, Designer, Product Lead" /></label>
              <Button>Save Profile</Button>
            </div>
          </section>

          <section className="card app-section">
            <div className="app-toolbar">
              <div><p className="app-kicker">Audit Preferences</p><h2 className="section-title">Default Audit Settings</h2></div>
              <ShieldCheck className="h-8 w-8 text-brand-300" />
            </div>

            <div className="mt-5 form-grid">
              <label>
                <span className="form-label">Default audit focus</span>
                <select className="ai-input" defaultValue="full">
                  <option value="full">Full UX + WCAG + Conversion</option>
                  <option value="accessibility">Accessibility first</option>
                  <option value="conversion">Conversion focused</option>
                  <option value="executive">Executive summary</option>
                </select>
              </label>
              <label>
                <span className="form-label">Default WCAG level</span>
                <select className="ai-input" defaultValue="aa">
                  <option value="a">WCAG A</option>
                  <option value="aa">WCAG AA</option>
                  <option value="aaa">WCAG AAA</option>
                </select>
              </label>
              <Button>Save Audit Preferences</Button>
            </div>
          </section>
        </div>

        <div className="settings-stack">
          <BillingCard plan={profile?.plan} status={profile?.subscription_status} periodEnd={profile?.subscription_current_period_end} stripeCustomerId={profile?.stripe_customer_id} compact />

          <section className="card app-section">
            <div className="app-toolbar">
              <div><p className="app-kicker">Reports</p><h2 className="section-title">Report Preferences</h2></div>
              <FileText className="h-8 w-8 text-brand-300" />
            </div>
            <div className="mt-5">
              {[
                ['PDF exports', 'Include score, findings, roadmap, and recommendations.'],
                ['Executive summary', 'Show a client-ready summary at the top of every report.'],
                ['Branding', 'Use saved company details in reports when available.'],
              ].map(([title, copy]) => (
                <div key={title} className="setting-row">
                  <div><p className="issue-row-title">{title}</p><p className="issue-row-copy">{copy}</p></div>
                  <span className="toggle-pill" aria-label={`${title} enabled`} />
                </div>
              ))}
            </div>
          </section>

          <section className="card app-section">
            <div className="app-toolbar">
              <div><p className="app-kicker">Notifications</p><h2 className="section-title">Email Preferences</h2></div>
              <Bell className="h-8 w-8 text-brand-300" />
            </div>
            <div className="mt-5">
              {[
                ['Audit complete', 'Email me when a long-running audit finishes.'],
                ['Weekly summary', 'Send a weekly summary of new reports and roadmap progress.'],
                ['Product updates', 'Notify me about new AIUX Insight features.'],
              ].map(([title, copy]) => (
                <div key={title} className="setting-row">
                  <div><p className="issue-row-title">{title}</p><p className="issue-row-copy">{copy}</p></div>
                  <span className="toggle-pill" aria-label={`${title} enabled`} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
