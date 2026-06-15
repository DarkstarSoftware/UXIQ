import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  BarChart3,
  FileText,
  GitCompare,
  Map,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

import { AnalyzeForm } from '@/components/audit/analyze-form';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

type ReportRow = {
  id: string;
  site_name: string | null;
  url: string | null;
  score: number | null;
  metrics: any;
  issues: any;
  summary: string | null;
  created_at: string;
};

type RoadmapRow = {
  id: string;
  title: string | null;
  site_name: string | null;
  url: string | null;
  items: any;
  created_at: string;
};

type CompetitorRow = {
  id: string;
  name: string | null;
  primary_url: string | null;
  results: any;
  summary: any;
  created_at: string;
};

function average(values: number[]) {
  const clean = values.filter((value) => Number.isFinite(value));
  if (!clean.length) return 0;
  return Math.round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function metricAverage(rows: ReportRow[], key: string) {
  return average(rows.map((row) => Number(row.metrics?.[key])).filter(Number.isFinite));
}

function scoreTone(score: number) {
  if (score >= 80) return 'Strong';
  if (score >= 65) return 'Needs Attention';
  if (score > 0) return 'High Priority';
  return 'No Data';
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

function getIssueList(reports: ReportRow[]) {
  const issues = reports.flatMap((report) => {
    const reportIssues = Array.isArray(report.issues) ? report.issues : [];
    return reportIssues.map((issue: any) => ({ ...issue, reportId: report.id, site: report.site_name }));
  });

  return issues
    .sort((a: any, b: any) => {
      const order: Record<string, number> = { HIGH: 3, MED: 2, LOW: 1 };
      return (order[b.severity] ?? 0) - (order[a.severity] ?? 0);
    })
    .slice(0, 6);
}

function trendValue(reports: ReportRow[]) {
  if (reports.length < 2) return 0;
  const newest = Number(reports[0]?.score ?? 0);
  const oldest = Number(reports[Math.min(reports.length - 1, 9)]?.score ?? 0);
  return newest - oldest;
}

function roadmapItemCount(roadmaps: RoadmapRow[]) {
  return roadmaps.reduce((sum, roadmap) => sum + (Array.isArray(roadmap.items) ? roadmap.items.length : 0), 0);
}

function StatCard({ label, value, note, icon: Icon }: { label: string; value: string | number; note: string; icon: any }) {
  return (
    <div className="card app-stat">
      <div className="app-toolbar">
        <div>
          <p className="app-stat-label">{label}</p>
          <p className="app-stat-value">{value}</p>
        </div>
        <Icon className="h-7 w-7 text-brand-300" aria-hidden="true" />
      </div>
      <p className="app-muted">{note}</p>
    </div>
  );
}

function MiniScoreCard({ label, score }: { label: string; score: string | number }) {
  return (
    <div className="score-metric-card">
      <span>{label}</span>
      <strong>{score}</strong>
    </div>
  );
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
    .limit(30);

  const { data: roadmapsData } = await supabase
    .from('roadmaps')
    .select('id, title, site_name, url, items, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(12);

  const { data: competitorsData } = await supabase
    .from('competitor_comparisons')
    .select('id, name, primary_url, results, summary, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(8);

  const reports = (reportsData ?? []) as ReportRow[];
  const roadmaps = (roadmapsData ?? []) as RoadmapRow[];
  const competitors = (competitorsData ?? []) as CompetitorRow[];

  const latestReport = reports[0];
  const totalAudits = reports.length;
  const avgScore = average(reports.map((report) => Number(report.score)).filter(Number.isFinite));
  const avgAccessibility = metricAverage(reports, 'accessibility');
  const avgConversion = metricAverage(reports, 'conversion');
  const avgUsability = metricAverage(reports, 'usability');
  const avgWcag = metricAverage(reports, 'wcag');
  const trend = trendValue(reports);
  const issues = getIssueList(reports);
  const roadmapItems = roadmapItemCount(roadmaps);
  const plan = planLabel(profile?.plan, profile?.subscription_status);

  const competitorAverage = competitors[0]?.summary?.industryAverage ?? competitors[0]?.results?.insights?.industryAverage;
  const competitorPosition = competitors[0]?.summary?.position ?? competitors[0]?.results?.insights?.position;

  return (
    <AppShell title="Dashboard" subtitle="Monitor UX scores, accessibility health, conversion opportunities, roadmaps, and competitor benchmarks">
      <section className="card app-section">
        <div className="score-shell">
          <div className="score-ring" aria-label={`Average UX score ${avgScore} out of 100`}>
            <div className="score-ring-inner">{avgScore || '—'}</div>
          </div>

          <div>
            <p className="app-kicker">AIUX Intelligence Overview</p>
            <h2 className="mt-3 text-5xl font-semibold tracking-tight text-white">
              {totalAudits ? `${scoreTone(avgScore)} UX portfolio health.` : 'Run your first real audit.'}
            </h2>
            <p className="mt-4 app-muted">
              {totalAudits
                ? `Based on ${totalAudits} saved audit${totalAudits === 1 ? '' : 's'}, ${roadmaps.length} roadmap${roadmaps.length === 1 ? '' : 's'}, and ${competitors.length} competitor comparison${competitors.length === 1 ? '' : 's'}.`
                : 'Start by analyzing a website. AIUX Insight will generate UX, WCAG, heuristic, conversion, roadmap, and competitor intelligence.'}
            </p>

            <div className="score-metric-grid">
              <MiniScoreCard label="Accessibility" score={avgAccessibility || '—'} />
              <MiniScoreCard label="Usability" score={avgUsability || '—'} />
              <MiniScoreCard label="Conversion" score={avgConversion || '—'} />
              <MiniScoreCard label="WCAG" score={avgWcag || '—'} />
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-metrics">
        <div className="app-grid-3">
          <StatCard label="Current plan" value={plan} note={`${profile?.audits_this_month ?? 0} audit${profile?.audits_this_month === 1 ? '' : 's'} this month.`} icon={Sparkles} />
          <StatCard label="Total audits" value={totalAudits} note="Saved reports generated from website analysis." icon={FileText} />
          <StatCard label="Roadmap items" value={roadmapItems} note={`${roadmaps.length} roadmap${roadmaps.length === 1 ? '' : 's'} generated.`} icon={Map} />
        </div>
      </section>

      <section className="dashboard-metrics">
        <div className="app-grid-3">
          <StatCard label="Score trend" value={trend > 0 ? `+${trend}` : trend} note={reports.length < 2 ? 'Run more audits to establish a trend.' : 'Difference between latest and earliest recent score.'} icon={TrendingUp} />
          <StatCard label="Competitor average" value={competitorAverage ?? '—'} note={competitors.length ? 'Latest competitor benchmark average.' : 'Create a competitor comparison to unlock this metric.'} icon={GitCompare} />
          <StatCard label="Competitive position" value={competitorPosition ? `#${competitorPosition}` : '—'} note={competitors.length ? 'Your latest ranking against selected competitors.' : 'Competitor rankings appear after a comparison.'} icon={BarChart3} />
        </div>
      </section>

      <section className="card app-section">
        <div className="app-toolbar">
          <div>
            <h2 className="section-title">Run a website audit</h2>
            <p className="app-muted">Analyze usability, WCAG-aware accessibility, Nielsen Norman heuristics, conversion friction, and page structure.</p>
          </div>
          <Search className="h-8 w-8 text-brand-300" aria-hidden="true" />
        </div>
        <AnalyzeForm />
      </section>

      <div className="settings-grid">
        <section className="card app-section">
          <div className="app-toolbar">
            <div>
              <p className="app-kicker">Latest report</p>
              <h2 className="section-title">Audit Snapshot</h2>
            </div>
            {latestReport ? (
              <Link href={`/reports/${latestReport.id}`}>
                <Button variant="secondary">Open Report <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            ) : null}
          </div>

          {latestReport ? (
            <div className="mt-5">
              <div className="score-shell">
                <div className="score-ring" aria-label={`Latest UX score ${latestReport.score} out of 100`}>
                  <div className="score-ring-inner">{latestReport.score}</div>
                </div>
                <div>
                  <p className="app-kicker">{latestReport.site_name}</p>
                  <h3 className="section-title">{scoreTone(Number(latestReport.score ?? 0))}</h3>
                  <p className="mt-3 app-muted">{latestReport.summary}</p>
                  <p className="mt-3 app-muted">{latestReport.url}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-5 app-muted">No reports yet. Run your first audit above.</p>
          )}
        </section>

        <section className="card app-section">
          <div className="app-toolbar">
            <div>
              <p className="app-kicker">Priority intelligence</p>
              <h2 className="section-title">Top Issues</h2>
            </div>
            <ShieldCheck className="h-8 w-8 text-brand-300" aria-hidden="true" />
          </div>

          {!issues.length ? (
            <p className="mt-5 app-muted">Top issues will appear after your first completed audit.</p>
          ) : (
            <div className="mt-5 grid gap-3">
              {issues.map((issue: any, index: number) => (
                <Link key={`${issue.reportId}-${issue.title}-${index}`} href={`/reports/${issue.reportId}`} className="issue-row">
                  <div className="issue-row-main">
                    <span className={severityClass(issue.severity)}>{issue.severity ?? 'LOW'}</span>
                    <div>
                      <p className="issue-row-title">{issue.title}</p>
                      <p className="issue-row-copy">{issue.site}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-brand-300" aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="settings-grid">
        <section className="card app-section">
          <div className="app-toolbar">
            <div>
              <p className="app-kicker">Recent reports</p>
              <h2 className="section-title">Saved Audits</h2>
            </div>
            <Link href="/reports"><Button variant="secondary">View All</Button></Link>
          </div>

          {!reports.length ? (
            <p className="mt-5 app-muted">Saved reports will appear here.</p>
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
            <Link href="/roadmaps"><Button variant="secondary">View All</Button></Link>
          </div>

          {!roadmaps.length ? (
            <p className="mt-5 app-muted">Generate a roadmap from a saved report to see it here.</p>
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
            <p className="app-kicker">Competitor intelligence</p>
            <h2 className="section-title">Recent Benchmarks</h2>
          </div>
          <Link href="/competitors"><Button variant="secondary">View Competitors</Button></Link>
        </div>

        {!competitors.length ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start gap-4">
              <Target className="h-8 w-8 text-brand-300" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-semibold text-white">Benchmark your UX against competitors</h3>
                <p className="mt-2 app-muted">Compare your website against up to three competitors to uncover score gaps, strengths, weaknesses, and recommended actions.</p>
                <div className="mt-5">
                  <Link href="/competitors/new"><Button>Add Comparison</Button></Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {competitors.slice(0, 4).map((comparison) => (
              <Link key={comparison.id} href={`/competitors/${comparison.id}`} className="issue-row">
                <div>
                  <p className="issue-row-title">{comparison.name}</p>
                  <p className="issue-row-copy">{comparison.summary?.summary ?? comparison.results?.summary ?? comparison.primary_url}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-brand-300" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="card app-section">
        <div className="app-toolbar">
          <div>
            <p className="app-kicker">Pro workflow</p>
            <h2 className="section-title">Turn audits into deliverables</h2>
          </div>
          <Activity className="h-8 w-8 text-brand-300" aria-hidden="true" />
        </div>

        <div className="mt-5 app-grid-3">
          {[
            ['Audit', 'Run a real UX, WCAG, heuristic, and conversion audit.'],
            ['Roadmap', 'Generate a prioritized 30/60/90 day improvement plan.'],
            ['Export', 'Create client-ready reports and share findings with stakeholders.'],
          ].map(([title, copy]) => (
            <div key={title} className="score-metric-card">
              <span>{title}</span>
              <p className="mt-3 app-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
