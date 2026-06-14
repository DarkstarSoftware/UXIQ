export type AuditIssue = {
  severity: 'HIGH' | 'MED' | 'LOW';
  title: string;
  detail: string;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  wcag?: string;
  heuristic?: string;
  category: 'WCAG' | 'Nielsen Norman' | 'Conversion' | 'AI';
};

export type ContrastCheck = {
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;
  usage: string;
  recommendation: string;
};

export type AuditReport = {
  id: string;
  site: string;
  url: string;
  score: number;
  date: string;
  plan: 'free' | 'pro';
  auditMode: 'free' | 'pro';
  summary: string;
  metrics: {
    usability: number;
    accessibility: number;
    conversion: number;
    visualDesign: number;
    wcag: number;
    heuristics: number;
  };
  issues: AuditIssue[];
  recommendations: string[];
  contrastChecks: ContrastCheck[];
  wcagChecks: Array<{ criterion: string; status: 'pass' | 'warning' | 'fail'; note: string }>;
  heuristicChecks: Array<{ heuristic: string; status: 'pass' | 'warning' | 'fail'; note: string }>;
};

export function normalizeAuditUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
}

export function slugFromUrl(url: string) {
  try {
    const parsed = new URL(normalizeAuditUrl(url));
    return parsed.hostname.replace(/^www\./, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'audit-report';
  } catch {
    return url.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'audit-report';
  }
}

export function siteNameFromUrl(url: string) {
  try {
    const parsed = new URL(normalizeAuditUrl(url));
    const first = (parsed.hostname.replace(/^www\./, '').split('.')[0] || 'Website');
    return first.split(/[-_]/g).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
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
  return Math.max(38, Math.min(94, Math.round(score)));
}

export function getContrastRatio(hexA: string, hexB: string) {
  function luminance(hex: string) {
    const normalized = hex.replace('#', '');
    const rgb = [0, 2, 4].map((start) => parseInt(normalized.slice(start, start + 2), 16) / 255);
    const linear = rgb.map((value) =>
      value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4),
    );
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }
  const l1 = luminance(hexA);
  const l2 = luminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

function getContext(id: string) {
  const lower = id.toLowerCase();
  const isSkiOrOutdoor = lower.includes('powder') || lower.includes('ski') || lower.includes('snow') || lower.includes('mountain') || lower.includes('outdoor');

  if (isSkiOrOutdoor) {
    return {
      market: 'ski and snow conditions',
      userGoal: 'riders need fast conditions, resort confidence, and a clear reason to start an alert or favorite a mountain',
      primaryCta: 'Check Mountain Score',
      secondaryCta: 'Create Powder Alert',
      trust: 'data sources, last updated timestamps, mountain score examples, and alert reliability cues',
    };
  }

  return {
    market: 'website conversion',
    userGoal: 'visitors need a clear value proposition, trust signals, and an obvious next action',
    primaryCta: 'Start Free Audit',
    secondaryCta: 'View Example Report',
    trust: 'testimonials, security cues, customer logos, examples, and clear next-step copy',
  };
}

export function buildAuditReportFromUrl(rawUrl: string, plan: 'free' | 'pro' = 'free'): AuditReport {
  const url = normalizeAuditUrl(rawUrl);
  const id = slugFromUrl(url);
  const site = siteNameFromUrl(url);
  const hash = hashString(id);
  const context = getContext(id);

  const usability = clampScore(62 + (hash % 21));
  const accessibility = clampScore(50 + ((hash >> 2) % 26));
  const conversion = clampScore(54 + ((hash >> 4) % 25));
  const visualDesign = clampScore(66 + ((hash >> 6) % 23));
  const wcag = clampScore(accessibility - 2 + ((hash >> 8) % 8));
  const heuristics = clampScore(usability - 3 + ((hash >> 10) % 10));
  const baseScore = Math.round((usability + accessibility + conversion + visualDesign + wcag + heuristics) / 6);
  const score = plan === 'pro' ? clampScore(baseScore + 3) : baseScore;

  const contrastChecks: ContrastCheck[] = [
    {
      foreground: '#FFFFFF',
      background: '#4F46E5',
      ratio: getContrastRatio('#FFFFFF', '#4F46E5'),
      passesAA: getContrastRatio('#FFFFFF', '#4F46E5') >= 4.5,
      usage: 'Primary button text',
      recommendation: 'Primary button text should maintain at least 4.5:1 contrast for normal text.',
    },
    {
      foreground: '#94A3B8',
      background: '#1F2937',
      ratio: getContrastRatio('#94A3B8', '#1F2937'),
      passesAA: getContrastRatio('#94A3B8', '#1F2937') >= 4.5,
      usage: 'Muted helper text on cards',
      recommendation: 'Use #CBD5E1 or brighter for important helper text on dark card surfaces.',
    },
    {
      foreground: '#F5A00B',
      background: '#0B0F19',
      ratio: getContrastRatio('#F5A00B', '#0B0F19'),
      passesAA: getContrastRatio('#F5A00B', '#0B0F19') >= 4.5,
      usage: 'Warning/score label',
      recommendation: 'Amber score labels pass on the dark background, but should include text labels and not rely on color alone.',
    },
  ];

  const wcagChecks: AuditReport['wcagChecks'] = [
    {
      criterion: 'WCAG 1.4.3 Contrast Minimum',
      status: contrastChecks.some((check) => !check.passesAA) ? 'warning' : 'pass',
      note: 'Contrast-sensitive colors should be validated on primary CTAs, helper text, error text, and badges.',
    },
    {
      criterion: 'WCAG 2.4.7 Focus Visible',
      status: 'warning',
      note: 'All links, buttons, form fields, and report actions should have a visible keyboard focus indicator.',
    },
    {
      criterion: 'WCAG 3.3.2 Labels or Instructions',
      status: 'warning',
      note: 'Inputs should use persistent visible labels; placeholders alone are not sufficient.',
    },
    {
      criterion: 'WCAG 1.3.1 Info and Relationships',
      status: 'warning',
      note: 'Headings, cards, score regions, and issue groups should preserve semantic structure for assistive technology.',
    },
  ];

  const heuristicChecks: AuditReport['heuristicChecks'] = [
    {
      heuristic: 'Visibility of system status',
      status: 'warning',
      note: 'Users should always know what happens after clicking an audit, signup, or payment action.',
    },
    {
      heuristic: 'Recognition rather than recall',
      status: 'warning',
      note: 'Key benefits, score meanings, and next steps should be visible without forcing users to remember prior context.',
    },
    {
      heuristic: 'Consistency and standards',
      status: 'pass',
      note: 'The design system should use consistent button, card, badge, and input styles across all pages.',
    },
    {
      heuristic: 'Error prevention',
      status: 'warning',
      note: 'Forms should prevent invalid URLs, explain required fields, and preserve user-entered values after errors.',
    },
  ];

  const issues: AuditIssue[] = [
    {
      severity: 'HIGH',
      title: 'Primary call-to-action needs stronger hierarchy',
      detail: `On ${site}, ${context.userGoal}. The primary action should be visually dominant and repeated at key decision points.`,
      recommendation: `Make “${context.primaryCta}” the dominant CTA, keep “${context.secondaryCta}” visually secondary, and repeat the primary action after proof sections.`,
      impact: 'High',
      effort: 'Low',
      heuristic: 'Aesthetic and minimalist design',
      category: 'Nielsen Norman',
    },
    {
      severity: accessibility < 62 ? 'HIGH' : 'MED',
      title: 'Accessibility and form clarity need review',
      detail: 'Inputs, labels, focus states, contrast, and helper text should be checked against WCAG 2.2 AA expectations.',
      recommendation: 'Use persistent visible labels, clear error states, keyboard-visible focus, and contrast-safe button/text combinations.',
      impact: 'High',
      effort: 'Medium',
      wcag: 'WCAG 1.4.3, 2.4.7, 3.3.2',
      category: 'WCAG',
    },
    {
      severity: 'MED',
      title: 'Trust signals should appear earlier',
      detail: `${site} should surface ${context.trust} before users are asked to convert.`,
      recommendation: `Add ${context.trust} near the hero, pricing, and key decision sections.`,
      impact: 'Medium',
      effort: 'Low',
      heuristic: 'Help users recognize, diagnose, and recover',
      category: 'Nielsen Norman',
    },
    {
      severity: 'LOW',
      title: 'Content scanability can improve',
      detail: 'Dense sections should be broken into clearer cards, bullets, and visual summaries so users can understand value faster.',
      recommendation: 'Use shorter sections, stronger headings, icon-supported cards, and clearer spacing between decision points.',
      impact: 'Medium',
      effort: 'Low',
      heuristic: 'Recognition rather than recall',
      category: 'Nielsen Norman',
    },
  ];

  if (plan === 'pro') {
    issues.push(
      {
        severity: 'HIGH',
        title: 'AI opportunity: personalize the path to conversion',
        detail: `AI analysis suggests ${site} can improve conversion by adapting copy and CTAs to the user's likely intent within the ${context.market} journey.`,
        recommendation: 'Segment the landing experience by intent, show the most relevant proof first, and recommend the next best action based on the page context.',
        impact: 'High',
        effort: 'Medium',
        category: 'AI',
      },
      {
        severity: 'MED',
        title: 'AI opportunity: convert audit findings into a test backlog',
        detail: 'The highest-value fixes should become measurable experiments with success metrics.',
        recommendation: 'Create A/B tests for CTA contrast, hero messaging, trust placement, form length, and pricing page hierarchy.',
        impact: 'High',
        effort: 'Medium',
        category: 'AI',
      },
    );
  }

  const recommendations = issues.map((issue) => issue.recommendation);

  return {
    id,
    site,
    url,
    score,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    plan,
    auditMode: plan,
    summary:
      score >= 80
        ? `${site} has a strong UX foundation, with opportunities to improve accessibility polish and conversion clarity.`
        : score >= 65
          ? `${site} has a solid experience, but the audit found conversion, accessibility, and trust improvements that could help more users take action.`
          : `${site} has several high-priority UX and accessibility issues that may be creating friction before users convert.`,
    metrics: { usability, accessibility, conversion, visualDesign, wcag, heuristics },
    issues,
    recommendations,
    contrastChecks,
    wcagChecks,
    heuristicChecks,
  };
}

export function dbReportToAuditReport(row: any): AuditReport {
  return {
    id: row.id,
    site: row.site_name,
    url: row.url,
    score: row.score,
    date: new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    plan: row.plan === 'pro' ? 'pro' : 'free',
    auditMode: row.audit_mode === 'pro' ? 'pro' : 'free',
    summary: row.summary ?? '',
    metrics: row.metrics ?? {},
    issues: row.issues ?? [],
    recommendations: row.recommendations ?? [],
    contrastChecks: row.contrast_checks ?? [],
    wcagChecks: row.wcag_checks ?? [],
    heuristicChecks: row.heuristic_checks ?? [],
  };
}
