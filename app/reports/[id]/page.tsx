import { redirect } from 'next/navigation';
import { Download } from 'lucide-react';

import { GenerateRoadmapButton } from './generate-roadmap-button';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { dbReportToAuditReport } from '@/lib/audit-engine';

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { id } = await params;

  if (!user) redirect(`/auth/login?redirect=/reports/${id}`);

  const { data } = await supabase
    .from('audit_reports')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!data) redirect('/reports');

  const report = dbReportToAuditReport(data);

  return (
    <AppShell
      title={report.site}
      subtitle={`Real UX audit for ${report.url}`}
      actions={
        <div className="app-toolbar-actions">
          <GenerateRoadmapButton reportId={report.id} />

          <Button variant="secondary">
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      }
    >
      <section className="card app-section">
        <div className="app-toolbar">
          <div>
            <p className="app-kicker">Audit Mode</p>
            <h2 className="section-title">
              {report.auditMode === 'pro'
                ? 'AI + WCAG + Nielsen Norman Heuristics'
                : 'WCAG + Nielsen Norman Heuristics'}
            </h2>
          </div>
          <span className={report.auditMode === 'pro' ? 'badge badge-pro' : 'badge badge-low'}>
            {report.auditMode === 'pro' ? 'Pro Audit' : 'Free Audit'}
          </span>
        </div>

        <div className="score-shell">
          <div className="score-ring" aria-label={`UX score ${report.score} out of 100`}>
            <div className="score-ring-inner">{report.score}</div>
          </div>

          <div>
            <p className="app-kicker">Report Summary</p>
            <h2 className="mt-3 text-5xl font-semibold tracking-tight text-white">
              {report.score >= 80
                ? 'Strong UX foundation.'
                : report.score >= 65
                  ? 'Good, but needs improvement.'
                  : 'High-priority UX issues found.'}
            </h2>
            <p className="mt-4 app-muted">{report.summary}</p>

            <div className="score-metric-grid">
              {[
                ['Usability', report.metrics.usability],
                ['Accessibility', report.metrics.accessibility],
                ['Conversion', report.metrics.conversion],
                ['Visual Design', report.metrics.visualDesign],
                ['WCAG', report.metrics.wcag],
                ['Heuristics', report.metrics.heuristics],
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

      <section className="card app-section">
        <h2 className="section-title">Page Structure Extracted</h2>
        <div className="mt-5 app-grid-3">
          <div className="score-metric-card">
            <span>Title</span>
            <p className="mt-3 app-muted">{report.extraction.title || 'Missing'}</p>
          </div>
          <div className="score-metric-card">
            <span>H1 Count</span>
            <strong>{report.extraction.h1.length}</strong>
          </div>
          <div className="score-metric-card">
            <span>Forms</span>
            <strong>{report.extraction.forms.length}</strong>
          </div>
          <div className="score-metric-card">
            <span>Images</span>
            <strong>{report.extraction.images.length}</strong>
          </div>
          <div className="score-metric-card">
            <span>Links</span>
            <strong>{report.extraction.links.length}</strong>
          </div>
          <div className="score-metric-card">
            <span>Words</span>
            <strong>{report.extraction.wordCount}</strong>
          </div>
        </div>
      </section>

      <section className="card app-section">
        <h2 className="section-title">Color Contrast Checks</h2>
        <div className="mt-5 grid gap-3">
          {report.contrastChecks.map((check) => (
            <div key={`${check.foreground}-${check.background}-${check.usage}`} className="issue-row">
              <div>
                <p className="issue-row-title">{check.usage}</p>
                <p className="issue-row-copy">
                  Foreground {check.foreground} on background {check.background}. Contrast ratio:{' '}
                  {check.ratio}:1.
                </p>
                <p className="mt-2 app-muted">{check.recommendation}</p>
              </div>
              <span className={check.passesAA ? 'badge badge-low' : 'badge badge-high'}>
                {check.passesAA ? 'Pass AA' : 'Review'}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card app-section">
        <h2 className="section-title">WCAG Checks</h2>
        <div className="mt-5 grid gap-3">
          {report.wcagChecks.map((check) => (
            <div key={check.criterion} className="issue-row">
              <div>
                <p className="issue-row-title">{check.criterion}</p>
                <p className="issue-row-copy">{check.note}</p>
              </div>
              <span
                className={
                  check.status === 'pass'
                    ? 'badge badge-low'
                    : check.status === 'fail'
                      ? 'badge badge-high'
                      : 'badge badge-med'
                }
              >
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card app-section">
        <h2 className="section-title">Nielsen Norman Heuristic Checks</h2>
        <div className="mt-5 grid gap-3">
          {report.heuristicChecks.map((check) => (
            <div key={check.heuristic} className="issue-row">
              <div>
                <p className="issue-row-title">{check.heuristic}</p>
                <p className="issue-row-copy">{check.note}</p>
              </div>
              <span
                className={
                  check.status === 'pass'
                    ? 'badge badge-low'
                    : check.status === 'fail'
                      ? 'badge badge-high'
                      : 'badge badge-med'
                }
              >
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card app-section">
        <h2 className="section-title">Issues and Recommended Fixes</h2>
        <div className="mt-5 grid gap-3">
          {report.issues.map((issue) => (
            <div key={issue.title} className="issue-row">
              <div className="issue-row-main">
                <span
                  className={
                    issue.severity === 'HIGH'
                      ? 'badge badge-high'
                      : issue.severity === 'MED'
                        ? 'badge badge-med'
                        : 'badge badge-low'
                  }
                >
                  {issue.severity}
                </span>

                <div>
                  <p className="issue-row-title">{issue.title}</p>
                  <p className="issue-row-copy">{issue.detail}</p>
                  <p className="mt-2 app-muted">
                    <strong>Fix:</strong> {issue.recommendation}
                  </p>
                  {issue.wcag ? (
                    <p className="mt-2 app-muted">
                      <strong>WCAG:</strong> {issue.wcag}
                    </p>
                  ) : null}
                  {issue.heuristic ? (
                    <p className="mt-2 app-muted">
                      <strong>Heuristic:</strong> {issue.heuristic}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="billing-actions">
                <span className="badge badge-pro">{issue.category}</span>
                <span className="badge badge-low">Impact {issue.impact}</span>
                <span className="badge badge-low">Effort {issue.effort}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
