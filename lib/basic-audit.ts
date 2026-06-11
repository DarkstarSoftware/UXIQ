import type { AuditResult } from '@/lib/audit';
import type { SiteSnapshot } from '@/lib/site-snapshot';

function scoreFromSnapshot(snapshot: SiteSnapshot) {
  let score = 74;

  if (!snapshot.title) score -= 8;
  if (!snapshot.metaDescription) score -= 6;
  if (snapshot.h1.length === 0) score -= 12;
  if (snapshot.buttonCount === 0) score -= 12;
  if (snapshot.inputCount > 5) score -= 6;
  if (snapshot.linkCount > 100) score -= 5;

  return Math.max(42, Math.min(92, score));
}

export function generateBasicAudit(snapshot: SiteSnapshot): AuditResult {
  const score = scoreFromSnapshot(snapshot);

  return {
    url: snapshot.normalizedUrl,
    normalizedUrl: snapshot.normalizedUrl,
    score,
    summary: 'Basic UX, WCAG-aware, and heuristic review complete.',
    source: 'basic',
    plan: 'free',
    categories: [
      {
        name: 'Usability',
        score: snapshot.h1.length ? 72 : 58,
        insight: 'Reviewed using Nielsen Norman-inspired usability principles.',
      },
      {
        name: 'Accessibility',
        score: snapshot.inputCount > 0 ? 64 : 70,
        insight: 'Basic WCAG-aware checks reviewed for structure and form complexity.',
      },
      {
        name: 'Conversion',
        score: snapshot.buttonCount > 0 ? 68 : 52,
        insight: 'Basic CTA and conversion path clarity reviewed.',
      },
      {
        name: 'Visual Design',
        score: 72,
        insight: 'Basic hierarchy and content structure reviewed from page markup.',
      },
    ],
    issues: [
      {
        severity: snapshot.h1.length ? 'Medium' : 'High',
        title: snapshot.h1.length ? 'Heading structure should be verified' : 'No H1 detected',
        body: snapshot.h1.length
          ? 'The page has a primary heading, but a full review should verify hierarchy and scanability.'
          : 'A missing H1 can reduce clarity for users, assistive technology, and search engines.',
      },
      {
        severity: snapshot.buttonCount > 0 ? 'Medium' : 'High',
        title: 'Primary action clarity requires review',
        body: 'Free audits identify basic CTA presence. Upgrade for AI analysis of hierarchy, placement, and conversion friction.',
      },
      {
        severity: 'Medium',
        title: 'WCAG review is limited on free plan',
        body: 'The free plan provides basic accessibility observations. Upgrade for deeper WCAG 2.2 AA-oriented recommendations.',
      },
    ],
    fixes: [
      {
        title: 'Verify primary page hierarchy',
        impact: 'Medium',
        effort: 'Low',
        description: 'Ensure the page has one clear H1 and a logical heading structure.',
      },
      {
        title: 'Clarify the main call to action',
        impact: 'High',
        effort: 'Medium',
        description: 'Make the most important user action visually dominant and easy to identify.',
      },
      {
        title: 'Upgrade for full AI report',
        impact: 'High',
        effort: 'Low',
        description: 'Full AI reports include deeper UX, WCAG, and conversion recommendations.',
      },
    ],
    snapshot: {
      title: snapshot.title,
      metaDescription: snapshot.metaDescription,
      h1: snapshot.h1,
      h2: snapshot.h2,
      buttonCount: snapshot.buttonCount,
      formCount: snapshot.formCount,
      inputCount: snapshot.inputCount,
      imageCount: snapshot.imageCount,
      linkCount: snapshot.linkCount,
    },
  };
}
