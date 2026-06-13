import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/dashboard');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, audits_this_month')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan ?? 'free';
  const reportType = plan === 'pro' ? 'AI-powered full audit' : 'Basic heuristic audit';

  return (
    <AppShell title="Dashboard" subtitle="Run audits and review UX, WCAG, accessibility, and conversion findings">
      <div className="app-grid-3">
        <div className="card app-stat">
          <p className="app-stat-label">Current plan</p>
          <p className="app-stat-value">{plan === 'pro' ? 'Pro' : 'Free'}</p>
          <p className="text-sm text-ui-muted">{profile?.subscription_status ?? 'inactive'}</p>
        </div>
        <div className="card app-stat">
          <p className="app-stat-label">Audits this month</p>
          <p className="app-stat-value">{profile?.audits_this_month ?? 0}</p>
        </div>
        <div className="card app-stat">
          <p className="app-stat-label">Report type</p>
          <p className="app-stat-value" style={{fontSize: '26px'}}>{reportType}</p>
        </div>
      </div>

      <section className="card app-section">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="section-title">Run a website audit</h2>
            <p className="mt-2 text-ui-muted">
              Enter a URL to analyze usability, accessibility, WCAG-aware issues, and conversion friction.
            </p>
          </div>
          <Search className="h-8 w-8 text-brand-300" aria-hidden="true" />
        </div>

        <form action="/api/audit" method="POST" className="mt-6 grid gap-3">
          <label>
            <span className="mb-2 block text-sm font-medium text-white">Website URL</span>
            <input className="ai-input" name="url" placeholder="https://example.com" required />
          </label>
          <Button type="submit">Analyze Site</Button>
        </form>
      </section>
    </AppShell>
  );
}
