import type { CategoryScore, Fix, Issue } from '@/lib/audit';

export const categoryScores: CategoryScore[] = [
  { name: 'Usability', score: 68, insight: 'Navigation clarity issues' },
  { name: 'Accessibility', score: 54, insight: 'Contrast and labeling gaps' },
  { name: 'Conversion', score: 61, insight: 'Weak CTA hierarchy' },
  { name: 'Visual Design', score: 80, insight: 'Mostly consistent UI system' },
];

export const topIssues: Issue[] = [
  { severity: 'High', title: 'CTA clarity needs improvement', body: 'The page needs a clearer primary action and stronger visual hierarchy.' },
  { severity: 'Medium', title: 'Accessibility signals need review', body: 'Basic checks indicate possible WCAG-related contrast, labeling, or structure concerns.' },
  { severity: 'Medium', title: 'Conversion path may be unclear', body: 'Users may need stronger guidance toward the next step.' },
  { severity: 'Low', title: 'Visual consistency could improve', body: 'Spacing, grouping, and repeated UI patterns should be reviewed for consistency.' },
];

export const fixes: Fix[] = [
  { title: 'Strengthen primary CTA hierarchy', impact: 'High', effort: 'Low', description: 'Use one dominant primary action and reduce competing calls to action.' },
  { title: 'Review WCAG basics', impact: 'High', effort: 'Medium', description: 'Check color contrast, form labels, headings, alt text, and keyboard access.' },
  { title: 'Reduce conversion friction', impact: 'Medium', effort: 'Low', description: 'Shorten forms, add trust signals, and clarify the value proposition above the fold.' },
];

export const reports = [
  { site: 'nike.com', score: 72, date: 'Apr 18, 2026', status: 'Good' },
  { site: 'acmecorp.com', score: 58, date: 'Apr 13, 2026', status: 'Needs work' },
  { site: 'techstartup.io', score: 83, date: 'Apr 5, 2026', status: 'Excellent' },
  { site: 'outdoorgear.com', score: 64, date: 'Mar 26, 2026', status: 'Some issues' },
];

export const competitors = [
  { site: 'nike.com', score: 72 },
  { site: 'adidas.com', score: 68 },
  { site: 'underarmour.com', score: 64 },
];
