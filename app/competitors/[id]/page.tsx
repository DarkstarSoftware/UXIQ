import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { createClient } from '@/lib/supabase/server';
import { enhanceComparisonResults } from '@/lib/competitor-analysis-v2';

function gapTone(value: number) {
  if (value >= 0) return 'badge badge-low';
  if (value <= -8) return 'badge badge-high';
  return 'badge badge-med';
}

function getLargestGap(gaps: Record<string, number> | undefined) {
  if (!gaps) return { label: 'None', value: 0 };

  const entries = Object.entries(gaps)
    .filter(([, value]) => typeof value === 'number')
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));

  const [key, value] = entries[0] ?? ['None', 0];

  return {
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase()),
    value,
  };
}

function RankingSection({
  title,
  sites,
  metric,
}: {
  title: string;
  sites: any[];
  metric: 'score' | 'accessibility' | 'conversion' | 'usability' | 'visualDesign';
}) {
  return (
    <section className="card app-section">
      <h2 className="section-title">{title}</h2>
      <div className="mt-5 grid gap-3">
        {sites?.map((site: any, index: number) => {
          const value = metric === 'score' ? site.score : site.metrics?.[metric];
          return (
            <div key={`${title}-${site.url}`} className="issue-row">
              <div>
                <p className="issue-row-title">#{index + 1} {site.site}</p>
                <p className="issue-row-copy">{site.url}</p>
              </div>
              <span className="score-chip">{value ?? '—'}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InsightList({ title, items, empty }: { title: string; items?: string[]; empty: string }) {
  return (
    <section className="card app-section">
      <h2 className="section-title">{title}</h2>
      <div className="mt-5 grid gap-3">
        {items?.length ? items.map((item) => (
          <div key={item} className="issue-row">
            <p className="issue-row-title">{item}</p>
          </div>
        )) : <p className="app-muted">{empty}</p>}
      </div>
    </section>
  );
}

export default async function CompetitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) redirect(`/auth/login?redirect=/competitors/${id}`);

  const { data } = await supabase
    .from('competitor_comparisons')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) redirect('/competitors');

  const results = enhanceComparisonResults(data.results ?? {});
  const insights = data.summary ?? results.insights ?? {};
  const sites = results.results ?? [];
  const rankings = results.rankings ?? {};
  const leader = results.leader ?? sites?.[0];
  const gaps = results.gapAnalysis ?? {};
  const largestGap = getLargestGap(gaps);

  const position = insights.position ?? rankings?.overall?.findIndex((site: any) => site.url === sites?.[0]?.url) + 1 || 1;

  return (
    <AppShell title={data.name} subtitle={results.summary ?? 'Competitor comparison results'}>
      <section className="card app-section">
        <p className="app-kicker">Executive Summary</p>
        <h2 className="section-title">Competitive Position</h2>
        <p className="mt-4 app-muted">
          {insights.summary ?? results.summary ?? 'This comparison reviews UX, accessibility, conversion, usability, visual design, strengths, weaknesses, and competitive gaps.'}
        </p>
      </section>

      <section className="card app-section">
        <div className="app-grid-3">
          <div className="score-metric-card"><span>Industry Average</span><strong>{insights.industryAverage ?? '—'}</strong><p className="mt-2 app-muted">Average score across selected competitors</p></div>
          <div className="score-metric-card"><span>Leader Score</span><strong>{insights.leaderScore ?? leader?.score ?? '—'}</strong><p className="mt-2 app-muted">{leader?.site ?? 'Current leader'}</p></div>
          <div className="score-metric-card"><span>Your Position</span><strong>#{position}</strong><p className="mt-2 app-muted">Out of {sites.length || 1} analyzed websites</p></div>
        </div>
      </section>

      <section className="card app-section">
        <div className="app-grid-3">
          <div className="score-metric-card"><span>Gap to Average</span><strong>{insights.gapToAverage ?? 0}</strong><p className="mt-2 app-muted"><span className={gapTone(insights.gapToAverage ?? 0)}>{(insights.gapToAverage ?? 0) >= 0 ? 'Above average' : 'Below average'}</span></p></div>
          <div className="score-metric-card"><span>Gap to Leader</span><strong>{insights.gapToLeader ?? 0}</strong><p className="mt-2 app-muted"><span className={gapTone(insights.gapToLeader ?? 0)}>{(insights.gapToLeader ?? 0) >= 0 ? 'Leading' : 'Behind leader'}</span></p></div>
          <div className="score-metric-card"><span>Largest Metric Gap</span><strong>{largestGap.label}</strong><p className="mt-2 app-muted">{largestGap.value} points</p></div>
        </div>
      </section>

      <section className="card app-section">
        <h2 className="section-title">Score Comparison</h2>
        <div className="comparison-grid">
          {sites.map((site: any, index: number) => (
            <article key={site.url} className="comparison-card">
              <span className="comparison-rank">{index + 1}</span>
              <p className="mt-5 app-kicker">{index === 0 ? 'Your Site' : 'Competitor'}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{site.site}</h3>
              <p className="comparison-score">{site.score}</p>
              <p className="app-muted">{site.url}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card app-section">
        <h2 className="section-title">Opportunities</h2>
        <div className="mt-5 grid gap-3">
          {insights.opportunities?.length ? insights.opportunities.map((opportunity: any) => (
            <div key={opportunity.title} className="issue-row">
              <div><p className="issue-row-title">{opportunity.title}</p><p className="issue-row-copy">{opportunity.detail}</p></div>
              <span className={opportunity.impact === 'High' ? 'badge badge-high' : opportunity.impact === 'Medium' ? 'badge badge-med' : 'badge badge-low'}>{opportunity.impact}</span>
            </div>
          )) : <p className="app-muted">No opportunities detected yet.</p>}
        </div>
      </section>

      <InsightList title="Competitive Strengths" items={insights.strengths} empty="Strengths will appear after a new v2 comparison is generated." />
      <InsightList title="Competitive Weaknesses" items={insights.weaknesses} empty="Weaknesses will appear after a new v2 comparison is generated." />
      <InsightList title="Recommended Actions" items={insights.recommendedActions} empty="Recommended actions will appear after a new v2 comparison is generated." />

      <section className="card app-section">
        <h2 className="section-title">Comparison Details</h2>
        <div className="mt-5 grid gap-3">
          {sites.map((site: any) => (
            <div key={site.url} className="issue-row">
              <div>
                <p className="issue-row-title">{site.site}</p>
                <p className="issue-row-copy">Strengths: {site.strengths?.length ? site.strengths.join(', ') : 'None detected yet'}</p>
                <p className="mt-2 app-muted">Weaknesses: {site.weaknesses?.length ? site.weaknesses.join(', ') : 'None detected yet'}</p>
              </div>
              <span className="score-chip">{site.score}</span>
            </div>
          ))}
        </div>
      </section>

      <RankingSection title="Overall UX Rankings" sites={rankings.overall ?? sites} metric="score" />
      <RankingSection title="Accessibility Rankings" sites={rankings.accessibility ?? sites} metric="accessibility" />
      <RankingSection title="Conversion Rankings" sites={rankings.conversion ?? sites} metric="conversion" />
      <RankingSection title="Usability Rankings" sites={rankings.usability ?? sites} metric="usability" />
      <RankingSection title="Visual Design Rankings" sites={rankings.visualDesign ?? sites} metric="visualDesign" />
    </AppShell>
  );
}
