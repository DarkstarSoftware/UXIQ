import { buildRealAuditReport, crawlWebsite, type AuditReport } from '@/lib/real-audit-engine';
import { buildRankings, generateCompetitiveInsights } from '@/lib/competitor-analysis-v2';

export type CompetitorResult = {
  site: string;
  url: string;
  score: number;
  metrics: AuditReport['metrics'];
  strengths: string[];
  weaknesses: string[];
};

function getStrengths(report: AuditReport) {
  const strengths: string[] = [];

  if (report.metrics.accessibility >= 80) strengths.push('Strong accessibility structure');
  if (report.metrics.conversion >= 80) strengths.push('Strong conversion path');
  if (report.metrics.usability >= 80) strengths.push('Strong usability foundation');
  if (report.extraction.h1.length === 1) strengths.push('Clear primary heading');
  if (report.extraction.buttons.length > 0) strengths.push('Detectable action buttons');

  if (!strengths.length) strengths.push('Baseline page structure detected');

  return strengths.slice(0, 5);
}

function getWeaknesses(report: AuditReport) {
  return report.issues.slice(0, 5).map((issue) => issue.title);
}

function buildGapAnalysis(primary: CompetitorResult, leader: CompetitorResult) {
  return {
    overall: (leader.score ?? 0) - (primary.score ?? 0),
    accessibility: (leader.metrics.accessibility ?? 0) - (primary.metrics.accessibility ?? 0),
    conversion: (leader.metrics.conversion ?? 0) - (primary.metrics.conversion ?? 0),
    usability: (leader.metrics.usability ?? 0) - (primary.metrics.usability ?? 0),
    visualDesign: (leader.metrics.visualDesign ?? 0) - (primary.metrics.visualDesign ?? 0),
  };
}

export async function runCompetitorComparison(primaryUrl: string, competitorUrls: string[]) {
  const urls = [primaryUrl, ...competitorUrls.filter(Boolean)].slice(0, 4);

  const reports = await Promise.all(
    urls.map(async (url) => buildRealAuditReport(await crawlWebsite(url), 'pro')),
  );

  const results: CompetitorResult[] = reports.map((report) => ({
    site: report.site,
    url: report.url,
    score: report.score,
    metrics: report.metrics,
    strengths: getStrengths(report),
    weaknesses: getWeaknesses(report),
  }));

  const rankings = buildRankings(results);
  const primary = results[0];
  const leader = (rankings.overall[0] ?? primary) as CompetitorResult;
const gapAnalysis = buildGapAnalysis(primary, leader);
  const insights = generateCompetitiveInsights(results);

  return {
    primary,
    competitors: results.slice(1),
    results,
    rankings,
    leader,
    gapAnalysis,
    insights,
    summary: insights.summary,
  };
}
