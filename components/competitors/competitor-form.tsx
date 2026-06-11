'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type CompetitorInsight = {
  site: string;
  score: number;
  summary: string;
  strengths: string[];
  opportunities: string[];
};

type CompetitorReport = {
  primaryUrl: string;
  competitors: string[];
  score: number;
  summary: string;
  insights: CompetitorInsight[];
  recommendation: string;
};

export function CompetitorForm() {
  const [primaryUrl, setPrimaryUrl] = useState('');
  const [competitorOne, setCompetitorOne] = useState('');
  const [competitorTwo, setCompetitorTwo] = useState('');
  const [competitorThree, setCompetitorThree] = useState('');

  const [report, setReport] = useState<CompetitorReport | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function runComparison(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setReport(null);

    try {
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryUrl,
          competitors: [competitorOne, competitorTwo, competitorThree].filter(Boolean),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Competitor analysis failed.');
      }

      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Competitor analysis failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="section-title">Run competitor analysis</h2>
        <p className="mt-2 text-sm text-ui-muted">
          Compare your site against up to three competitors and identify market-level UX opportunities.
        </p>

        <form onSubmit={runComparison} className="mt-5 grid gap-3">
          <Input
            value={primaryUrl}
            onChange={(event) => setPrimaryUrl(event.target.value)}
            placeholder="Your website, e.g. powderiq.com"
            required
          />

          <div className="grid gap-3 md:grid-cols-3">
            <Input
              value={competitorOne}
              onChange={(event) => setCompetitorOne(event.target.value)}
              placeholder="Competitor 1"
              required
            />
            <Input
              value={competitorTwo}
              onChange={(event) => setCompetitorTwo(event.target.value)}
              placeholder="Competitor 2"
            />
            <Input
              value={competitorThree}
              onChange={(event) => setCompetitorThree(event.target.value)}
              placeholder="Competitor 3"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Sites'}
          </Button>
        </form>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}
      </div>

      {report ? (
        <div className="space-y-6">
          <div className="card p-6">
            <p className="text-sm text-ui-muted">Darkstar competitive score</p>
            <p className="mt-3 text-6xl font-semibold text-white">{report.score}</p>
            <p className="mt-3 text-sm text-ui-muted">{report.summary}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {report.insights.map((item) => (
              <div key={item.site} className="card p-5">
                <p className="truncate text-sm text-ui-muted">{item.site}</p>
                <p className="mt-3 text-4xl font-semibold text-white">{item.score}</p>
                <p className="mt-3 text-sm text-ui-muted">{item.summary}</p>

                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-300">Opportunities</p>
                  <ul className="mt-2 space-y-1 text-sm text-ui-muted">
                    {item.opportunities.map((opportunity) => (
                      <li key={opportunity}>• {opportunity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h2 className="section-title">Recommendation</h2>
            <p className="mt-3 text-sm text-ui-muted">{report.recommendation}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
