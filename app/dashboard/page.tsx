import { redirect } from 'next/navigation';
import { ChevronRight, Search, Sparkles } from 'lucide-react';

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

  return (
    <AppShell title="Dashboard" subtitle="Run audits and review UX, WCAG, accessibility, and conversion findings">
      <section className="card app-section">
        <div className="score-shell">
          <div className="score-ring" aria-label="UX score 72 out of 100">
            <div className="score-ring-inner">72</div>
          </div>

          <div>
            <p className="ai-kicker">UX Score</p>
            <h2 className="mt-3 text-5xl font-black tracking-tight text-white">
              Good, but losing conversions.
            </h2>
            <p className="mt-4 max-w-2xl text-ui-muted">
              Your current audit profile shows opportunities around CTA clarity, accessibility,
              and conversion hierarchy.
            </p>

            <div className="mt-6 app-grid-3">
              {[
                ['Usability', '68'],
                ['Accessibility', '54'],
                ['Conversion', '61'],
              ].map(([label, score]) => (
                <div key={label} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4">
                  <p className="text-sm text-ui-muted">{label}</p>
                  <p className="mt-2 text-4xl font-black text-white">{score}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="app-grid-3 mt-5">
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
          <p className="app-stat-value" style={{ fontSize: '26px' }}>
            {plan === 'pro' ? 'Full AI' : 'Basic'}
          </p>
        </div>
      </div>

      <section className="card app-section">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="section-title">Run a website audit</h2>
            <p className="mt-2 text-ui-muted">
              Analyze usability, WCAG-aware accessibility, conversion friction, and visual hierarchy.
            </p>
          </div>
          <Search className="h-8 w-8 text-brand-300" aria-hidden="true" />
        </div>

        <form action="/api/audit" method="POST" className="mt-6 grid gap-3">
          <label>
            <span className="mb-2 block text-sm font-medium text-white">Website URL</span>
            <input className="ai-input" name="url" placeholder="https://example.com" required />
          </label>
          <Button type="submit">
            Analyze Site <Sparkles className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      </section>

      <section className="card app-section">
        <h2 className="section-title">Top Issues</h2>
        <div className="mt-5 grid gap-3">
          {[
            ['HIGH', 'CTA button lacks contrast'],
            ['HIGH', 'No clear call-to-action above the fold'],
            ['MED', 'Form is too long and requests unnecessary info'],
            ['LOW', 'Inconsistent spacing and alignment'],
          ].map(([severity, issue]) => (
            <div key={issue} className="issue-row">
              <div className="flex items-center gap-3">
                <span className={severity === 'HIGH' ? 'badge badge-high' : severity === 'MED' ? 'badge badge-med' : 'badge badge-low'}>
                  {severity}
                </span>
                <span className="font-semibold text-white">{issue}</span>
              </div>
              <ChevronRight className="h-5 w-5 text-ui-muted" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
