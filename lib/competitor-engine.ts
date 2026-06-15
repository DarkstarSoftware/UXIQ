import { buildRealAuditReport, crawlWebsite, type AuditReport } from '@/lib/real-audit-engine';

function strengths(report: AuditReport) {
  const list: string[] = [];

  if (report.metrics.accessibility >= 80)
    list.push('Strong accessibility');

  if (report.metrics.conversion >= 80)
    list.push('Strong conversion path');

  if (report.extraction.h1.length === 1)
    list.push('Clear heading hierarchy');

  if (report.extraction.buttons.length > 0)
    list.push('Visible CTAs');

  return list.slice(0, 4);
}

function weaknesses(report: AuditReport) {
  return report.issues.slice(0, 4).map(issue => issue.title);
}

function buildRankings(results: any[]) {
  return {
    overall: [...results].sort((a,b)=>b.score-a.score),
    accessibility: [...results].sort(
      (a,b)=>b.metrics.accessibility-a.metrics.accessibility
    ),
    conversion: [...results].sort(
      (a,b)=>b.metrics.conversion-a.metrics.conversion
    ),
    usability: [...results].sort(
      (a,b)=>b.metrics.usability-a.metrics.usability
    ),
  };
}

export async function runCompetitorComparison(
  primaryUrl:string,
  competitorUrls:string[]
) {
  const urls = [
    primaryUrl,
    ...competitorUrls.filter(Boolean)
  ].slice(0,4);

  const reports = await Promise.all(
    urls.map(async url =>
      buildRealAuditReport(
        await crawlWebsite(url),
        'pro'
      )
    )
  );

  const results = reports.map(report => ({
    site: report.site,
    url: report.url,
    score: report.score,
    metrics: report.metrics,
    strengths: strengths(report),
    weaknesses: weaknesses(report),
  }));

  const rankings = buildRankings(results);

  const primary = results[0];

  const leader = rankings.overall[0];

  const gapAnalysis = {
    overall: leader.score - primary.score,
    accessibility:
      leader.metrics.accessibility -
      primary.metrics.accessibility,

    conversion:
      leader.metrics.conversion -
      primary.metrics.conversion,

    usability:
      leader.metrics.usability -
      primary.metrics.usability,
  };

  return {
    primary,
    competitors: results.slice(1),
    results,
    rankings,
    leader,
    gapAnalysis,

    summary:
      `${primary.site} ranks #${
        rankings.overall.findIndex(
          x => x.url === primary.url
        ) + 1
      } of ${results.length} websites analyzed.`,
  };
}