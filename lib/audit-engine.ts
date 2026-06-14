export type AuditIssue = {
  severity: 'HIGH' | 'MED' | 'LOW';
  title: string;
  detail: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
};

export type AuditReport = {
  id: string;
  site: string;
  url: string;
  score: number;
  date: string;
  summary: string;
  metrics: {
    usability: number;
    accessibility: number;
    conversion: number;
    visualDesign: number;
  };
  issues: AuditIssue[];
};

export function normalizeAuditUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;
}

export function slugFromUrl(url: string) {
  try {
    const normalized = normalizeAuditUrl(url);
    const parsed = new URL(normalized);
    return (
      parsed.hostname
        .replace(/^www\./, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase() || 'audit-report'
    );
  } catch {
    return (
      url
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase() || 'audit-report'
    );
  }
}

export function siteNameFromUrl(url: string) {
  try {
    const parsed = new URL(normalizeAuditUrl(url));
    const host = parsed.hostname.replace(/^www\./, '');
    const first = host.split('.')[0] || host;
    return first
      .split(/[-_]/g)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  } catch {
    return url || 'Website';
  }
}

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function clampScore(score: number) {
  return Math.max(42, Math.min(92, score));
}

export function buildAuditReportFromUrl(rawUrl: string): AuditReport {
  const url = normalizeAuditUrl(rawUrl);
  const id = slugFromUrl(url);
  const site = siteNameFromUrl(url);
  const hash = hashString(id);

  const usability = clampScore(62 + (hash % 21));
  const accessibility = clampScore(50 + ((hash >> 2) % 26));
  const conversion = clampScore(54 + ((hash >> 4) % 25));
  const visualDesign = clampScore(66 + ((hash >> 6) % 23));
  const score = Math.round((usability + accessibility + conversion + visualDesign) / 4);

  const lower = id.toLowerCase();
  const isSkiOrOutdoor =
    lower.includes('powder') ||
    lower.includes('ski') ||
    lower.includes('snow') ||
    lower.includes('mountain') ||
    lower.includes('outdoor');

  const primaryContext = isSkiOrOutdoor
    ? 'riders need fast conditions, resort confidence, and a clear reason to start an alert or favorite a mountain'
    : 'visitors need a clear value proposition, trust signals, and an obvious next action';

  const issues: AuditIssue[] = [
    {
      severity: 'HIGH',
      title: 'Primary call-to-action needs stronger hierarchy',
      detail: `On ${site}, ${primaryContext}. The primary action should be visually dominant and repeated at key decision points.`,
      recommendation: isSkiOrOutdoor
        ? 'Make “Check Mountain Score” or “Create Powder Alert” the dominant CTA above the fold, then repeat it after forecast and resort sections.'
        : 'Use one dominant CTA above the fold, reduce competing actions, and repeat the primary action after the key proof points.',
      impact: 'High',
      effort: 'Low',
    },
    {
      severity: accessibility < 62 ? 'HIGH' : 'MED',
      title: 'Accessibility and form clarity need review',
      detail: 'Inputs, labels, focus states, contrast, and helper text should be checked against WCAG 2.2 AA expectations.',
      recommendation: 'Use persistent visible labels, clear error states, keyboard-visible focus, and contrast-safe button/text combinations.',
      impact: 'High',
      effort: 'Medium',
    },
    {
      severity: 'MED',
      title: 'Trust signals should appear earlier',
      detail: isSkiOrOutdoor
        ? 'Weather and snow products need clear data sources, update timing, and confidence cues before users commit.'
        : 'Users need stronger credibility cues before signing up, starting a trial, or submitting information.',
      recommendation: isSkiOrOutdoor
        ? 'Add data source labels, last updated timestamps, sample mountain scores, and proof that alerts are timely and useful.'
        : 'Add testimonials, security cues, use cases, customer logos, guarantees, or clear “what happens next” copy near conversion points.',
      impact: 'Medium',
      effort: 'Low',
    },
    {
      severity: 'LOW',
      title: 'Content scanability can improve',
      detail: 'Dense sections should be broken into clearer cards, bullets, and visual summaries so users can understand value faster.',
      recommendation: 'Use shorter sections, stronger headings, icon-supported cards, and clearer spacing between decision points.',
      impact: 'Medium',
      effort: 'Low',
    },
  ];

  return {
    id,
    site,
    url,
    score,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    summary:
      score >= 80
        ? `${site} has a strong UX foundation, with opportunities to improve accessibility polish and conversion clarity.`
        : score >= 65
          ? `${site} has a solid experience, but the audit found conversion, accessibility, and trust improvements that could help more users take action.`
          : `${site} has several high-priority UX and accessibility issues that may be creating friction before users convert.`,
    metrics: {
      usability,
      accessibility,
      conversion,
      visualDesign,
    },
    issues,
  };
}
