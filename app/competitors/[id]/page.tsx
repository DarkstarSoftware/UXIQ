import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { createClient } from '@/lib/supabase/server';

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
                <p className="issue-row-title">
                  #{index + 1} {site.site}
                </p>
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

export default async function CompetitorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) redirect(`/auth/login?redirect=/competitors/${id}`);

  const { data } = await supabase
    .from('competitor_comparisons')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) redirect('/competitors');

  const results = data.results ?? {};
  const sites = results?.results ?? [];
  const rankings = results?.rankings ?? {};
  const leader = results?.leader ?? sites?.[0];
  const gaps = results?.gapAnalysis ?? {};
  const largestGap = getLargestGap(gaps);

  const position =
    rankings?.overall?.findIndex((site: any) => site.url === sites?.[0]?.url) + 1 || 1;

  return (
    <AppShell
      title={data.name}
      subtitle={results?.summary ?? 'Competitor comparison results'}
    >
      <section className="card app-section">
        <p className="app-kicker">Executive Summary</p>
        <h2 className="section-title">Competitive Position</h2>
        <p className="mt-4 app-muted">
          {results?.summary ??
            'This comparison reviews overall UX, accessibility, conversion, usability, visual design, strengths, weaknesses, and competitive gaps.'}
        </p>
      </section>

      <section className="card app-section">
        <div className="app-grid-3">
          <div className="score-metric-card">
            <span>Winner</span>
            <strong>{leader?.site ?? '—'}</strong>
            <p className="mt-2 app-muted">{leader?.score ?? '—'} overall score</p>
          </div>

          <div className="score-metric-card">
            <span>Your Position</span>
            <strong>#{position}</strong>
            <p className="mt-2 app-muted">Out of {sites.length || 1} analyzed websites</p>
          </div>

          <div className="score-metric-card">
            <span>Largest Gap</span>
            <strong>{largestGap.label}</strong>
            <p className="mt-2 app-muted">{largestGap.value} points</p>
          </div>
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
        <h2 className="section-title">Comparison Details</h2>

        <div className="mt-5 grid gap-3">
          {sites.map((site: any) => (
            <div key={site.url} className="issue-row">
              <div>
                <p className="issue-row-title">{site.site}</p>
                <p className="issue-row-copy">
                  Strengths: {site.strengths?.length ? site.strengths.join(', ') : 'None detected yet'}
                </p>
                <p className="mt-2 app-muted">
                  Weaknesses: {site.weaknesses?.length ? site.weaknesses.join(', ') : 'None detected yet'}
                </p>
              </div>

              <span className="score-chip">{site.score}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card app-section">
        <h2 className="section-title">Gap Analysis</h2>

        <div className="score-metric-grid">
          <div className="score-metric-card">
            <span>Overall Gap</span>
            <strong>{gaps?.overall ?? 0}</strong>
          </div>

          <div className="score-metric-card">
            <span>Accessibility Gap</span>
            <strong>{gaps?.accessibility ?? 0}</strong>
          </div>

          <div className="score-metric-card">
            <span>Conversion Gap</span>
            <strong>{gaps?.conversion ?? 0}</strong>
          </div>

          <div className="score-metric-card">
            <span>Usability Gap</span>
            <strong>{gaps?.usability ?? 0}</strong>
          </div>
        </div>
      </section>

      <RankingSection
        title="Overall UX Rankings"
        sites={rankings?.overall ?? sites}
        metric="score"
      />

      <RankingSection
        title="Accessibility Rankings"
        sites={rankings?.accessibility ?? sites}
        metric="accessibility"
      />

      <RankingSection
        title="Conversion Rankings"
        sites={rankings?.conversion ?? sites}
        metric="conversion"
      />

      <RankingSection
        title="Usability Rankings"
        sites={rankings?.usability ?? sites}
        metric="usability"
      />
    </AppShell>
  );
}