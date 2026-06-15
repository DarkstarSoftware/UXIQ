import { type AuditIssue, type AuditReport } from '@/lib/audit-engine';

export type RoadmapPhase = 'Quick Wins' | '30 Days' | '60 Days' | '90 Days';

export type RoadmapItem = {
  title: string;
  description: string;
  sourceIssue: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  priority: number;
  phase: RoadmapPhase;
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

function getPhase(issue: AuditIssue): RoadmapPhase {
  if (issue.impact === 'High' && issue.effort === 'Low') return 'Quick Wins';
  if (issue.impact === 'High' && issue.effort === 'Medium') return '30 Days';
  if (issue.effort === 'High') return '90 Days';
  return '60 Days';
}

function getMetric(issue: AuditIssue) {
  if (issue.category === 'WCAG') return 'Reduce WCAG warnings and increase accessibility score.';
  if (issue.category === 'Conversion') return 'Increase CTA engagement or completed conversions.';
  if (issue.category === 'AI') return 'Validate recommendation through experiment lift or qualitative feedback.';
  return 'Improve task clarity, navigation success, and user confidence.';
}

function phaseItems(items: RoadmapItem[], phase: RoadmapPhase) {
  return items.filter((item) => item.phase === phase);
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

  const quickWins = phaseItems(items, 'Quick Wins');
  const thirtyDay = phaseItems(items, '30 Days');
  const sixtyDay = phaseItems(items, '60 Days');
  const ninetyDay = phaseItems(items, '90 Days');

  return {
    title: `${report.site} UX Roadmap`,
    site_name: report.site,
    url: report.url,
    summary: `Prioritized roadmap generated from ${report.site}'s UX audit. Start with quick wins, then move through 30, 60, and 90 day improvements.`,
    items,

    // Existing DB compatibility
    quick_wins: quickWins,
    next_phase: [...thirtyDay, ...sixtyDay],
    strategic_initiatives: ninetyDay,

    // View-model convenience
    quickWins,
    thirtyDay,
    sixtyDay,
    ninetyDay,
  };
}

function normalizeItems(row: any): RoadmapItem[] {
  return Array.isArray(row.items) ? row.items : [];
}

export function dbRoadmapToView(row: any) {
  const items = normalizeItems(row);
  const quickWins = items.filter((item) => item.phase === 'Quick Wins');
  const thirtyDay = items.filter((item) => item.phase === '30 Days');
  const sixtyDay = items.filter((item) => item.phase === '60 Days');
  const ninetyDay = items.filter((item) => item.phase === '90 Days');

  // Backward compatibility for older saved roadmaps
  const legacyQuickWins = quickWins.length ? quickWins : row.quick_wins ?? [];
  const legacyNextPhase = thirtyDay.length || sixtyDay.length ? [...thirtyDay, ...sixtyDay] : row.next_phase ?? [];
  const legacyStrategic = ninetyDay.length ? ninetyDay : row.strategic_initiatives ?? [];

  return {
    id: row.id,
    auditReportId: row.audit_report_id,
    title: row.title,
    siteName: row.site_name,
    url: row.url,
    summary: row.summary,
    items,
    quickWins: legacyQuickWins,
    thirtyDay,
    sixtyDay,
    ninetyDay: legacyStrategic,
    nextPhase: legacyNextPhase,
    strategicInitiatives: legacyStrategic,
    createdAt: row.created_at,
  };
}
