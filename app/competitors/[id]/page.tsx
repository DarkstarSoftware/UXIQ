import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { createClient } from '@/lib/supabase/server';

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

  const results = data.results;
  const sites = results?.results ?? [];

  return (
    <AppShell title={data.name} subtitle={results?.summary ?? 'Competitor comparison results'}>
      <section className="card app-section">
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
                <p className="issue-row-copy">Strengths: {site.strengths?.join(', ')}</p>
                <p className="mt-2 app-muted">Weaknesses: {site.weaknesses?.join(', ')}</p>
              </div>
              <span className="score-chip">{site.score}</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
