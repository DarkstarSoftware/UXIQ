type CompetitorSite = {
  site: string;
  url: string;
  score: number;
  metrics?: {
    accessibility?: number;
    conversion?: number;
    usability?: number;
    visualDesign?: number;
    wcag?: number;
    heuristics?: number;
  };
  strengths?: string[];
  weaknesses?: string[];
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function scoreFor(site: CompetitorSite, metric: string) {
  if (metric === 'overall') return site.score ?? 0;
  return Number(site.metrics?.[metric as keyof NonNullable<CompetitorSite['metrics']>] ?? 0);
}

function rankBy(results: CompetitorSite[], metric: string) {
  return [...results].sort((a, b) => scoreFor(b, metric) - scoreFor(a, metric));
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function buildStrengths(primary: CompetitorSite, allSites: CompetitorSite[]) {
  const strengths = [...(primary.strengths ?? [])];

  const avgAccessibility = average(allSites.map((site) => Number(site.metrics?.accessibility ?? 0)));
  const avgUsability = average(allSites.map((site) => Number(site.metrics?.usability ?? 0)));

  if ((primary.metrics?.accessibility ?? 0) >= avgAccessibility) {
    strengths.push('Accessibility is at or above the competitor average.');
  }

  if ((primary.metrics?.usability ?? 0) >= avgUsability) {
    strengths.push('Usability is at or above the competitor average.');
  }

  if ((primary.metrics?.wcag ?? 0) >= 80) {
    strengths.push('WCAG score shows a strong accessibility foundation.');
  }

  return unique(strengths).slice(0, 6);
}

function buildWeaknesses(primary: CompetitorSite, leader: CompetitorSite, allSites: CompetitorSite[]) {
  const weaknesses = [...(primary.weaknesses ?? [])];

  const avgConversion = average(allSites.map((site) => Number(site.metrics?.conversion ?? 0)));
  const avgAccessibility = average(allSites.map((site) => Number(site.metrics?.accessibility ?? 0)));

  if ((primary.metrics?.conversion ?? 0) < avgConversion) {
    weaknesses.push('Conversion score trails the competitor average.');
  }

  if ((primary.metrics?.accessibility ?? 0) < avgAccessibility) {
    weaknesses.push('Accessibility score trails the competitor average.');
  }

  if ((leader.score ?? 0) - (primary.score ?? 0) >= 8) {
    weaknesses.push(`Overall UX score is behind ${leader.site}, the current leader.`);
  }

  return unique(weaknesses).slice(0, 6);
}

function buildOpportunities(primary: CompetitorSite, leader: CompetitorSite) {
  const opportunities: Array<{ title: string; detail: string; impact: 'High' | 'Medium' | 'Low' }> = [];

  const conversionGap = (leader.metrics?.conversion ?? 0) - (primary.metrics?.conversion ?? 0);
  const accessibilityGap = (leader.metrics?.accessibility ?? 0) - (primary.metrics?.accessibility ?? 0);
  const usabilityGap = (leader.metrics?.usability ?? 0) - (primary.metrics?.usability ?? 0);
  const visualGap = (leader.metrics?.visualDesign ?? 0) - (primary.metrics?.visualDesign ?? 0);

  if (conversionGap > 0) opportunities.push({ title: 'Improve conversion hierarchy', detail: `Close the ${conversionGap}-point conversion gap by improving CTA visibility, trust placement, and form friction.`, impact: conversionGap >= 8 ? 'High' : 'Medium' });
  if (accessibilityGap > 0) opportunities.push({ title: 'Strengthen accessibility coverage', detail: `Close the ${accessibilityGap}-point accessibility gap by improving labels, headings, contrast, and accessible names.`, impact: accessibilityGap >= 8 ? 'High' : 'Medium' });
  if (usabilityGap > 0) opportunities.push({ title: 'Improve usability clarity', detail: `Close the ${usabilityGap}-point usability gap by simplifying navigation, clarifying page structure, and improving scanability.`, impact: usabilityGap >= 8 ? 'High' : 'Medium' });
  if (visualGap > 0) opportunities.push({ title: 'Polish visual hierarchy', detail: `Close the ${visualGap}-point visual design gap by improving spacing, typography hierarchy, and contrast.`, impact: visualGap >= 8 ? 'High' : 'Medium' });

  if (!opportunities.length) {
    opportunities.push({ title: 'Maintain competitive advantage', detail: 'Your site is competitive against the selected set. Continue testing CTA hierarchy, accessibility, and trust signals.', impact: 'Medium' });
  }

  return opportunities.slice(0, 8);
}

export function buildRankings(results: CompetitorSite[]) {
  return {
    overall: rankBy(results, 'overall'),
    accessibility: rankBy(results, 'accessibility'),
    conversion: rankBy(results, 'conversion'),
    usability: rankBy(results, 'usability'),
    visualDesign: rankBy(results, 'visualDesign'),
  };
}

export function generateCompetitiveInsights(results: CompetitorSite[]) {
  const sites = results.filter(Boolean);
  const primary = sites[0];
  const rankings = buildRankings(sites);
  const leader = rankings.overall[0] ?? primary;

  if (!primary) {
    return {
      industryAverage: 0,
      leaderScore: 0,
      gapToLeader: 0,
      gapToAverage: 0,
      position: 0,
      totalSites: 0,
      strengths: [],
      weaknesses: [],
      opportunities: [],
      recommendedActions: [],
      summary: 'No competitor results are available yet.',
    };
  }

  const industryAverage = average(sites.map((site) => Number(site.score ?? 0)));
  const leaderScore = leader.score ?? 0;
  const gapToLeader = primary.score - leaderScore;
  const gapToAverage = primary.score - industryAverage;
  const position = rankings.overall.findIndex((site) => site.url === primary.url) + 1;
  const strengths = buildStrengths(primary, sites);
  const weaknesses = buildWeaknesses(primary, leader, sites);
  const opportunities = buildOpportunities(primary, leader);

  return {
    industryAverage,
    leaderScore,
    gapToLeader,
    gapToAverage,
    position,
    totalSites: sites.length,
    strengths,
    weaknesses,
    opportunities,
    recommendedActions: opportunities.map((opportunity) => opportunity.title).slice(0, 6),
    summary:
      `${primary.site} ranks #${position} of ${sites.length} analyzed websites. ` +
      `${leader.site} leads with a score of ${leaderScore}. ` +
      `The primary site is ${Math.abs(gapToAverage)} point${Math.abs(gapToAverage) === 1 ? '' : 's'} ` +
      `${gapToAverage >= 0 ? 'above' : 'below'} the competitor average.`,
  };
}

export function enhanceComparisonResults(rawResults: any) {
  const results = rawResults?.results ?? [];
  const rankings = rawResults?.rankings ?? buildRankings(results);
  const leader = rawResults?.leader ?? rankings.overall?.[0] ?? results[0];
  const insights = rawResults?.insights ?? generateCompetitiveInsights(results);

  return {
    ...rawResults,
    results,
    rankings,
    leader,
    insights,
    summary: insights.summary ?? rawResults?.summary,
  };
}
