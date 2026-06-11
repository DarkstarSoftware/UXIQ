import { generateBasicAudit } from '@/lib/basic-audit';
import { fetchSiteSnapshot, normalizeUrl } from '@/lib/site-snapshot';

export type CompetitorInsight = {
  site: string;
  score: number;
  summary: string;
  strengths: string[];
  opportunities: string[];
};

export type CompetitorReport = {
  primaryUrl: string;
  competitors: string[];
  score: number;
  summary: string;
  insights: CompetitorInsight[];
  recommendation: string;
};

function buildStrengths(score: number) {
  if (score >= 80) {
    return ['Strong structure', 'Clear baseline UX signals', 'Good content organization'];
  }

  if (score >= 65) {
    return ['Reasonable content structure', 'Some clear conversion signals', 'Usable baseline experience'];
  }

  return ['Has a visible foundation to improve from', 'Basic content is available', 'Likely optimization opportunities exist'];
}

function buildOpportunities(score: number) {
  if (score >= 80) {
    return ['Refine conversion hierarchy', 'Validate WCAG details', 'Improve differentiation messaging'];
  }

  if (score >= 65) {
    return ['Improve CTA clarity', 'Review accessibility patterns', 'Reduce friction in key paths'];
  }

  return ['Clarify page hierarchy', 'Strengthen accessibility basics', 'Improve conversion path visibility'];
}

export async function generateCompetitorReport(
  primaryUrlRaw: string,
  competitorUrlRaws: string[],
): Promise<CompetitorReport> {
  const urls = [primaryUrlRaw, ...competitorUrlRaws]
    .map((url) => normalizeUrl(url))
    .filter(Boolean)
    .slice(0, 4);

  const snapshots = await Promise.all(urls.map((url) => fetchSiteSnapshot(url)));
  const audits = snapshots.map((snapshot) => generateBasicAudit(snapshot));

  const insights: CompetitorInsight[] = audits.map((audit) => ({
    site: audit.normalizedUrl,
    score: audit.score,
    summary: audit.summary,
    strengths: buildStrengths(audit.score),
    opportunities: buildOpportunities(audit.score),
  }));

  const primaryScore = insights[0]?.score ?? 0;
  const competitorAverage =
    insights.slice(1).reduce((sum, item) => sum + item.score, 0) /
    Math.max(insights.slice(1).length, 1);

  const score = Math.round(primaryScore - competitorAverage + 70);

  return {
    primaryUrl: insights[0]?.site ?? normalizeUrl(primaryUrlRaw),
    competitors: insights.slice(1).map((item) => item.site),
    score: Math.max(0, Math.min(100, score)),
    summary:
      primaryScore >= competitorAverage
        ? 'Your site is competitive, with opportunities to sharpen conversion and accessibility.'
        : 'Competitors show stronger baseline UX signals. Prioritize clarity, accessibility, and conversion hierarchy.',
    insights,
    recommendation:
      'Use this comparison as a starting point. Run full Pro AI audits on the primary site and competitors for deeper recommendations.',
  };
}
