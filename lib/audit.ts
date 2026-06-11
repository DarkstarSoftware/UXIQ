export type Severity = 'High' | 'Medium' | 'Low';
export type Plan = 'free' | 'pro';

export type CategoryScore = {
  name: 'Usability' | 'Accessibility' | 'Conversion' | 'Visual Design';
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
  id?: string;
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
  snapshot?: {
    title?: string;
    metaDescription?: string;
    h1?: string[];
    h2?: string[];
    buttonCount?: number;
    formCount?: number;
    inputCount?: number;
    imageCount?: number;
    linkCount?: number;
  };
};
