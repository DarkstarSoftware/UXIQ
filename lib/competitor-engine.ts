import { buildRealAuditReport, crawlWebsite, type AuditReport } from '@/lib/real-audit-engine';

function strengths(report: AuditReport) {
  const list: string[] = [];
  if (report.metrics.accessibility >= 80) list.push('Strong accessibility structure');
  if (report.metrics.conversion >= 80) list.push('Clear conversion path');
  if (report.extraction.h1.length === 1) list.push('Clear primary heading');
  if (report.extraction.buttons.length > 0) list.push('Detectable action buttons');
  return list.length ? list.slice(0, 3) : ['Baseline page structure detected'];
}

export async function runCompetitorComparison(primaryUrl: string, competitorUrls: string[]) {
  const urls = [primaryUrl, ...competitorUrls.filter(Boolean)].slice(0, 4);
  const reports = await Promise.all(urls.map(async (url) => buildRealAuditReport(await crawlWebsite(url), 'pro')));
  const results = reports.map((report) => ({
    site: report.site,
    url: report.url,
    score: report.score,
    metrics: report.metrics,
    strengths: strengths(report),
    weaknesses: report.issues.slice(0, 3).map((issue) => issue.title),
  }));
  const sorted = [...results].sort((a, b) => b.score - a.score);
  return {
    primary: results[0],
    competitors: results.slice(1),
    results,
    leader: sorted[0],
    summary: `${sorted[0].site} leads this comparison with a UX score of ${sorted[0].score}.`,
  };
}
