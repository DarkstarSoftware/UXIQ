export function formatDate(value?: string | null) {
  if (!value) return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function safeText(value: unknown, fallback = 'Not available') {
  if (typeof value !== 'string') return fallback;
  return value.trim() || fallback;
}

export function scoreLabel(score?: number | null) {
  if (!score && score !== 0) return 'Not scored';
  if (score >= 80) return 'Strong';
  if (score >= 65) return 'Needs Improvement';
  return 'High Priority';
}

export function limitForPlan<T>(items: T[], isPro: boolean, freeLimit = 5) {
  return isPro ? items : items.slice(0, freeLimit);
}
