import { redirect } from 'next/navigation';
import { BillingCard } from '@/components/billing/billing-card';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/settings');
  const { data: profile } = await supabase.from('profiles').select('plan, subscription_status, subscription_current_period_end').eq('id', user.id).single();

  return (
    <AppShell title="Settings" subtitle="Manage your account, preferences, billing, and integrations">
      <div className="settings-grid">
        <div className="settings-stack">
          <section className="card app-section"><p className="app-kicker">Profile</p><h2 className="section-title">Account Details</h2><div className="mt-5 form-grid"><label><span className="form-label">Email</span><input className="ai-input" value={user.email ?? ''} readOnly /></label><label><span className="form-label">Default audit settings</span><select className="ai-input" defaultValue="deep"><option value="deep">Deep UX + WCAG recommended</option><option value="conversion">Conversion focused</option><option value="accessibility">Accessibility focused</option></select></label><Button>Save Changes</Button></div></section>
          <section className="card app-section"><p className="app-kicker">Accessibility Defaults</p><h2 className="section-title">Audit Preferences</h2><div className="mt-5">{[['WCAG 2.2 AA checks','Review contrast, form labels, focus states, alt text, and keyboard access.'],['Nielsen Norman heuristics','Review visibility, consistency, control, recognition, and error prevention.'],['Conversion review','Review CTA clarity, hierarchy, friction, trust, and next-step visibility.'],['Visual design review','Review spacing, hierarchy, scanability, and polish.']].map(([title,copy])=><div key={title} className="setting-row"><div><p className="issue-row-title">{title}</p><p className="issue-row-copy">{copy}</p></div><span className="toggle-pill" aria-label={`${title} enabled`} /></div>)}</div></section>
        </div>
        <div className="settings-stack">
          <BillingCard plan={profile?.plan} status={profile?.subscription_status} periodEnd={profile?.subscription_current_period_end} compact />
          <section className="card app-section"><p className="app-kicker">API & Integrations</p><h2 className="section-title">Connected Services</h2><div className="mt-5 grid gap-3">{[['Stripe Billing','Active subscription and billing portal integration.'],['Supabase Auth','User accounts, profiles, and plan access.'],['AI Audit Engine','UX, accessibility, and conversion analysis.'],['Report Export','Client-ready report and roadmap workflow.']].map(([title,copy])=><div key={title} className="issue-row"><div><p className="issue-row-title">{title}</p><p className="issue-row-copy">{copy}</p></div><span className="badge badge-low">Active</span></div>)}</div></section>
        </div>
      </div>
    </AppShell>
  );
}
