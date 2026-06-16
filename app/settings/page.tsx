import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Bell, FileText, ShieldCheck, UserCircle } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { getBillingPlanDescription, getBillingPlanLabel, getBillingPlanPrice } from '@/lib/billing-plan';

function PreferenceRow({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="setting-row">
      <div>
        <p className="issue-row-title">{title}</p>
        <p className="issue-row-copy">{copy}</p>
      </div>
      <span className="toggle-pill" aria-label={`${title} enabled`} />
    </div>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/settings');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, subscription_current_period_end, full_name, company, role')
    .eq('id', user.id)
    .single();

  const planLabel = getBillingPlanLabel(profile?.plan, profile?.subscription_status);
  const planPrice = getBillingPlanPrice(profile?.plan, profile?.subscription_status);
  const planDescription = getBillingPlanDescription(profile?.plan, profile?.subscription_status);

  return (
    <AppShell title="Settings" subtitle="Manage your profile, subscription, audit defaults, and report preferences">
      <div className="settings-grid">
        <div className="settings-stack">
          <section className="card app-section">
            <div className="app-toolbar">
              <div>
                <p className="app-kicker">Profile</p>
                <h2 className="section-title">Account Details</h2>
              </div>
              <UserCircle className="h-7 w-7 text-brand-300" aria-hidden="true" />
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-xl font-semibold text-white">
                  {(user.email?.[0] ?? 'U').toUpperCase()}
                </div>
                <div>
                  <p className="issue-row-title">Profile photo</p>
                  <p className="issue-row-copy">Avatar upload will be available soon.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 form-grid">
              <label>
                <span className="form-label">Full name</span>
                <input className="ai-input" value={profile?.full_name ?? 'Todd Fleury'} readOnly />
              </label>

              <label>
                <span className="form-label">Email</span>
                <input className="ai-input" value={user.email ?? ''} readOnly />
              </label>

              <label>
                <span className="form-label">Company</span>
                <input className="ai-input" value={profile?.company ?? 'AIUX Insight'} readOnly />
              </label>

              <label>
                <span className="form-label">Role</span>
                <input className="ai-input" value={profile?.role ?? 'Founder, Designer, Product Lead'} readOnly />
              </label>

              <Button>Save Profile</Button>
            </div>
          </section>

          <section className="card app-section">
            <div className="app-toolbar">
              <div>
                <p className="app-kicker">Audit Preferences</p>
                <h2 className="section-title">Default Audit Settings</h2>
              </div>
              <ShieldCheck className="h-7 w-7 text-brand-300" aria-hidden="true" />
            </div>

            <div className="mt-5 form-grid">
              <label>
                <span className="form-label">Default audit focus</span>
                <select className="ai-input" defaultValue="full">
                  <option value="full">Full UX + WCAG + Conversion</option>
                  <option value="conversion">Conversion focused</option>
                  <option value="accessibility">Accessibility focused</option>
                </select>
              </label>

              <label>
                <span className="form-label">Default WCAG level</span>
                <select className="ai-input" defaultValue="aa">
                  <option value="aa">WCAG AA</option>
                  <option value="aaa">WCAG AAA</option>
                </select>
              </label>

              <Button>Save Audit Preferences</Button>
            </div>
          </section>
        </div>

        <div className="settings-stack">
          <section className="card app-section">
            <p className="app-kicker">Subscription</p>
            <h2 className="section-title">Current Plan</h2>

            <div className="mt-5 issue-row">
              <div>
                <p className="issue-row-title">{planLabel}</p>
                <p className="issue-row-copy">{planPrice} · {planDescription}</p>
              </div>

              <Link href="/billing">
                <Button>Manage Billing</Button>
              </Link>
            </div>
          </section>

          <section className="card app-section">
            <div className="app-toolbar">
              <div>
                <p className="app-kicker">Reports</p>
                <h2 className="section-title">Report Preferences</h2>
              </div>
              <FileText className="h-7 w-7 text-brand-300" aria-hidden="true" />
            </div>

            <div className="mt-5">
              <PreferenceRow title="PDF exports" copy="Include score, findings, roadmap, and recommendations." />
              <PreferenceRow title="Executive summary" copy="Show a client-ready summary at the top of every report." />
              <PreferenceRow title="Branding" copy="Use saved company details in reports when available." />
            </div>
          </section>

          <section className="card app-section">
            <div className="app-toolbar">
              <div>
                <p className="app-kicker">Notifications</p>
                <h2 className="section-title">Email Preferences</h2>
              </div>
              <Bell className="h-7 w-7 text-brand-300" aria-hidden="true" />
            </div>

            <div className="mt-5">
              <PreferenceRow title="Audit complete" copy="Email me when a long-running audit finishes." />
              <PreferenceRow title="Weekly summary" copy="Send a weekly summary of new reports and roadmap progress." />
              <PreferenceRow title="Product updates" copy="Notify me about new AIUX Insight features." />
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
