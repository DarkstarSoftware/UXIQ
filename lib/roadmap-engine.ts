import { type AuditIssue, type AuditReport } from '@/lib/audit-engine';

export type RoadmapItem = {
  title: string;
  description: string;
  sourceIssue: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  priority: number;
  phase: 'Quick Wins' | 'Next Phase' | 'Strategic Initiatives';
  successMetric: string;
};

function impactValue(value: string) {
  if (value === 'High') return 3;
  if (value === 'Medium') return 2;
  return 1;
}

function effortValue(value: string) {
  if (value === 'Low') return 3;
  if (value === 'Medium') return 2;
  return 1;
}

function getPhase(issue: AuditIssue) {
  if (issue.impact === 'High' && issue.effort === 'Low') return 'Quick Wins' as const;
  if (issue.effort === 'High') return 'Strategic Initiatives' as const;
  return 'Next Phase' as const;
}

function getMetric(issue: AuditIssue) {
  if (issue.category === 'WCAG') return 'Reduce WCAG warnings and increase accessibility score.';
  if (issue.category === 'Conversion') return 'Increase CTA engagement or completed conversions.';
  if (issue.category === 'AI') return 'Validate with experiment lift or qualitative feedback.';
  return 'Improve task clarity, navigation success, and user confidence.';
}

export function buildRoadmapFromReport(report: AuditReport) {
  const items: RoadmapItem[] = report.issues
    .map((issue, index) => {
      const priority = impactValue(issue.impact) * 10 + effortValue(issue.effort) * 4 - index;
      return {
        title: issue.recommendation,
        description: issue.detail,
        sourceIssue: issue.title,
        category: issue.category,
        impact: issue.impact,
        effort: issue.effort,
        priority,
        phase: getPhase(issue),
        successMetric: getMetric(issue),
      };
    })
    .sort((a, b) => b.priority - a.priority)
    .map((item, index) => ({ ...item, priority: index + 1 }));

  return {
    title: `${report.site} UX Roadmap`,
    site_name: report.site,
    url: report.url,
    summary: `Prioritized roadmap generated from ${report.site}'s UX audit.`,
    items,
    quick_wins: items.filter((item) => item.phase === 'Quick Wins'),
    next_phase: items.filter((item) => item.phase === 'Next Phase'),
    strategic_initiatives: items.filter((item) => item.phase === 'Strategic Initiatives'),
  };
}

export function dbRoadmapToView(row: any) {
  return {
    id: row.id,
    auditReportId: row.audit_report_id,
    title: row.title,
    siteName: row.site_name,
    url: row.url,
    summary: row.summary,
    items: row.items ?? [],
    quickWins: row.quick_wins ?? [],
    nextPhase: row.next_phase ?? [],
    strategicInitiatives: row.strategic_initiatives ?? [],
    createdAt: row.created_at,
  };
}
