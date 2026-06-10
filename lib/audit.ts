export type Plan = 'free' | 'pro' | 'agency';
export type CategoryName = 'Usability' | 'Accessibility' | 'Conversion' | 'Visual Design';
export type Severity = 'High' | 'Medium' | 'Low';

export type CategoryScore = {
  name: CategoryName;
  score: number;
  insight: string;
};

export type Issue = {
  severity: Severity;
  title: string;
  body: string;
};

export type Fix = {
  title: string;
  impact: Severity;
  effort: Severity;
  description: string;
};

export type AuditResult = {
  url: string;
  normalizedUrl: string;
  score: number;
  summary: string;
  categories: CategoryScore[];
  issues: Issue[];
  fixes: Fix[];
  source: 'basic' | 'openai' | 'fallback';
  plan: Plan;
  note?: string;
  locked?: {
    title: string;
    body: string;
    features: string[];
  };
  snapshot?: Record<string, unknown>;
};
