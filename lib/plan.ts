import type { Plan } from '@/lib/audit';

export function normalizePlan(value: unknown): Plan {
  return value === 'pro' ? 'pro' : 'free';
}
