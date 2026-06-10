import type { AuditResult, CategoryScore, Fix, Issue } from '@/lib/audit';
import type { SiteSnapshot } from '@/lib/site-snapshot';

function clamp(value: number) { return Math.max(0, Math.min(100, Math.round(value))); }

export function generateBasicAudit(snapshot: SiteSnapshot, plan: 'free' | 'pro' | 'agency' = 'free'): AuditResult {
  const hasH1 = snapshot.h1.length > 0;
  const hasMeta = snapshot.metaDescription.length > 0;
  const hasButtons = snapshot.buttonCount > 0;
  const missingAltRatio = snapshot.imageCount ? snapshot.missingAltCount / snapshot.imageCount : 0;
  const hasFormFriction = snapshot.inputCount > 5;

  const usability = clamp(70 + (hasH1 ? 8 : -12) + (snapshot.linkCount > 80 ? -8 : 4));
  const accessibility = clamp(76 + (missingAltRatio > 0.3 ? -18 : 6) + (snapshot.inputCount && snapshot.formCount ? -4 : 2));
  const conversion = clamp(68 + (hasButtons ? 10 : -14) + (hasMeta ? 4 : -4) + (hasFormFriction ? -10 : 2));
  const visual = clamp(74 + (snapshot.h2.length > 1 ? 6 : -4));
  const score = clamp((usability + accessibility + conversion + visual) / 4);

  const categories: CategoryScore[] = [
    { name: 'Usability', score: usability, insight: hasH1 ? 'Basic page structure is detectable.' : 'No clear H1 was detected.' },
    { name: 'Accessibility', score: accessibility, insight: 'Basic WCAG-aware checks reviewed headings, forms, and image alt coverage.' },
    { name: 'Conversion', score: conversion, insight: hasButtons ? 'Primary action elements are present.' : 'No obvious CTA button was detected.' },
    { name: 'Visual Design', score: visual, insight: 'Basic structure and content hierarchy were reviewed.' },
  ];

  const issues: Issue[] = [
    { severity: hasButtons ? 'Medium' : 'High', title: hasButtons ? 'CTA hierarchy should be reviewed' : 'No obvious CTA detected', body: 'Free audits identify basic conversion signals only. Upgrade for AI-backed page-specific prioritization.' },
    { severity: missingAltRatio > 0.3 ? 'High' : 'Medium', title: 'Accessibility basics need validation', body: 'Review WCAG basics including alt text, contrast, labels, headings, keyboard access, and focus states.' },
    { severity: hasH1 ? 'Low' : 'Medium', title: 'Information architecture should be checked', body: 'Nielsen Norman-inspired review suggests verifying clarity, recognition over recall, and content hierarchy.' },
  ];

  const fixes: Fix[] = [
    { title: 'Clarify the primary action', impact: 'High', effort: 'Low', description: 'Make the next step obvious above the fold and reduce competing actions.' },
    { title: 'Run WCAG checks', impact: 'High', effort: 'Medium', description: 'Validate contrast, headings, labels, alt text, keyboard navigation, and focus states.' },
  ];

  return {
    url: snapshot.url,
    normalizedUrl: snapshot.normalizedUrl,
    score,
    summary: 'Basic UX snapshot generated.',
    categories,
    issues,
    fixes,
    source: 'basic',
    plan,
    locked: {
      title: 'Unlock the full AI audit',
      body: 'Paid users receive deeper AI-generated findings, prioritized fixes, conversion impact, competitor insights, and page-specific recommendations.',
      features: ['Full AI analysis', 'Prioritized fixes', 'Conversion impact'],
    },
    snapshot: {
      title: snapshot.title,
      h1: snapshot.h1,
      h2: snapshot.h2,
      buttonCount: snapshot.buttonCount,
      formCount: snapshot.formCount,
      inputCount: snapshot.inputCount,
      imageCount: snapshot.imageCount,
      linkCount: snapshot.linkCount,
      missingAltCount: snapshot.missingAltCount,
    },
  };
}
