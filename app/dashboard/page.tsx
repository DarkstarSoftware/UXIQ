import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, FileText, Map, Search, TrendingUp } from 'lucide-react';

import { AnalyzeForm } from '@/components/audit/analyze-form';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function metricAverage(rows: any[], key: string) {
  const values = rows
    .map((row) => Number(row.metrics?.[key]))
    .filter((value) => Number.isFinite(value));
  return average(values);
}

function planLabel(plan?: string | null, status?: string | null) {
  if (status === 'lifetime' || plan === 'pro_lifetime') return 'Pro Lifetime';
  if (plan === 'pro' || status === 'active' || status === 'trialing') return 'Pro';
  return 'Free';
}

function severityClass(severity?: string) {
  if (severity === 'HIGH') return 'badge badge-high';
  if (severity === 'MED') return 'badge badge-med';
  return 'badge badge-low';
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirect=/dashboard');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, audits_this_month')
    .eq('id', user.id)
    .single();

  const { data: reportsData } = await supabase
    .from('audit_reports')
    .select('id, site_name, url, score, metrics, issues, summary, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(25);

  const { data: roadmapsData } = await supabase
    .from('roadmaps')
    .select('id, title, site_name, url, items, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const reports = reportsData ?? [];
  const roadmaps = roadmapsData ?? [];
  const latestReport = reports[0];

  const totalAudits = reports.length;
  const averageScore = average(reports.map((report) => Number(report.score)).filter(Number.isFinite));
  const averageAccessibility = metricAverage(reports, 'accessibility');
  const averageConversion = metricAverage(reports, 'conversion');
  const averageUsability = metricAverage(reports, 'usability');
  const plan = planLabel(profile?.plan, profile?.subscription_status);

  const latestIssues = Array.isArray(latestReport?.issues)
    ? latestReport.issues.slice(0, 5)
    : [];

  return (
    <AppShell
      title="Dashboard"
      subtitle="Run audits and track UX, WCAG, accessibility, conversion, reports, and roadmaps"
    >
      <section className="card app-section">
        <div className="score-shell">
          <div className="score-ring" aria-label={`Average UX score ${averageScore} out of 100`}>
            <div className="score-ring-inner">{averageScore || '—'}</div>
          </div>

          <div>
            <p className="app-kicker">Average UX Score</p>
            <h2 className="mt-3 text-5xl font-semibold tracking-tight text-white">
              {totalAudits
                ? averageScore >= 80
                  ? 'Strong UX performance.'
                  : averageScore >= 65
                    ? 'Good, with room to improve.'
                    : 'High-priority improvements found.'
                : 'Run your first real audit.'}
            </h2>
            <p className="mt-4 app-muted">
              {totalAudits
                ? `Based on ${totalAudits} saved audit${totalAudits === 1 ? '' : 's'}. Your dashboard now reflects real report data.`
                : 'Analyze a website to generate real UX, WCAG, heuristic, and conversion findings.'}
            </p>

            <div className="score-metric-grid">
              {[
                ['Usability', averageUsability || '—'],
                ['Accessibility', averageAccessibility || '—'],
                ['Conversion', averageConversion || '—'],
                ['Roadmaps', roadmaps.length],
              ].map(([label, score]) => (
                <div key={label} className="score-metric-card">
                  <span>{label}</span>
                  <strong>{score}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="app-grid-3 mt-5">
        <div className="card app-stat">
          <p className="app-stat-label">Current plan</p>
          <p className="app-stat-value">{plan}</p>
          <p className="app-muted">{profile?.subscription_status ?? 'inactive'}</p>
        </div>

        <div className="card app-stat">
          <p className="app-stat-label">Total audits</p>
          <p className="app-stat-value">{totalAudits}</p>
          <p className="app-muted">{profile?.audits_this_month ?? 0} audit{profile?.audits_this_month === 1 ? '' : 's'} this month.</p>
        </div>

        <div className="card app-stat">
          <p className="app-stat-label">Roadmaps generated</p>
          <p className="app-stat-value">{roadmaps.length}</p>
          <p className="app-muted">Roadmaps turn findings into prioritized action plans.</p>
        </div>
      </div>

      <section className="card app-section">
        <div className="app-toolbar">
          <div>
            <h2 className="section-title">Run a website audit</h2>
            <p className="app-muted">
              Analyze usability, WCAG-aware accessibility, conversion friction, visual hierarchy, and page structure.
            </p>
          </div>
          <Search className="h-8 w-8 text-brand-300" aria-hidden="true" />
        </div>
        <AnalyzeForm />
      </section>

      <div className="settings-grid">
        <section className="card app-section">
          <div className="app-toolbar">
            <div>
              <p className="app-kicker">Recent reports</p>
              <h2 className="section-title">Saved Audits</h2>
            </div>
            <Link href="/reports">
              <Button variant="secondary">
                <FileText className="h-4 w-4" /> View All
              </Button>
            </Link>
          </div>

          {!reports.length ? (
            <p className="mt-5 app-muted">No reports yet. Run your first audit above.</p>
          ) : (
            <div className="mt-5 grid gap-3">
              {reports.slice(0, 5).map((report) => (
                <Link key={report.id} href={`/reports/${report.id}`} className="issue-row">
                  <div>
                    <p className="issue-row-title">{report.site_name}</p>
                    <p className="issue-row-copy">{report.url}</p>
                  </div>
                  <span className="score-chip">{report.score}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="card app-section">
          <div className="app-toolbar">
            <div>
              <p className="app-kicker">Recent roadmaps</p>
              <h2 className="section-title">Action Plans</h2>
            </div>
            <Link href="/roadmaps">
              <Button variant="secondary">
                <Map className="h-4 w-4" /> View All
              </Button>
            </Link>
          </div>

          {!roadmaps.length ? (
            <p className="mt-5 app-muted">No roadmaps yet. Open a report and generate a roadmap.</p>
          ) : (
            <div className="mt-5 grid gap-3">
              {roadmaps.slice(0, 5).map((roadmap) => (
                <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`} className="issue-row">
                  <div>
                    <p className="issue-row-title">{roadmap.title}</p>
                    <p className="issue-row-copy">{roadmap.url}</p>
                  </div>
                  <span className="score-chip">{Array.isArray(roadmap.items) ? roadmap.items.length : 0}</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card app-section">
        <div className="app-toolbar">
          <div>
            <p className="app-kicker">Latest audit findings</p>
            <h2 className="section-title">Top Issues</h2>
          </div>
          <TrendingUp className="h-8 w-8 text-brand-300" aria-hidden="true" />
        </div>

        {!latestIssues.length ? (
          <p className="mt-5 app-muted">Top issues will appear after your first completed audit.</p>
        ) : (
          <div className="mt-5 grid gap-3">
            {latestIssues.map((issue: any) => (
              <div key={issue.title} className="issue-row">
                <div className="issue-row-main">
                  <span className={severityClass(issue.severity)}>{issue.severity ?? 'LOW'}</span>
                  <div>
                    <p className="issue-row-title">{issue.title}</p>
                    <p className="issue-row-copy">{issue.detail}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-brand-300" aria-hidden="true" />
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
