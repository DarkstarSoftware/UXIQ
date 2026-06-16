export type BillingPlanKey = 'free' | 'monthly' | 'annual' | 'lifetime';

export function getBillingPlanKey(plan?: string | null, status?: string | null): BillingPlanKey {
  if (plan === 'pro_lifetime' || status === 'lifetime') return 'lifetime';
  if (plan === 'pro_annual') return 'annual';

  if (
    plan === 'pro' ||
    status === 'active' ||
    status === 'trialing'
  ) {
    return 'monthly';
  }

  return 'free';
}

export function getBillingPlanLabel(plan?: string | null, status?: string | null) {
  const key = getBillingPlanKey(plan, status);

  if (key === 'lifetime') return 'Lifetime Member';
  if (key === 'annual') return 'Pro Annual';
  if (key === 'monthly') return 'Pro Monthly';

  return 'Free';
}

export function getBillingPlanPrice(plan?: string | null, status?: string | null) {
  const key = getBillingPlanKey(plan, status);

  if (key === 'lifetime') return '$299.99 one-time';
  if (key === 'annual') return '$99.99/year';
  if (key === 'monthly') return '$9.99/month';

  return '$0';
}

export function isPaidPlan(plan?: string | null, status?: string | null) {
  return getBillingPlanKey(plan, status) !== 'free';
}

export function isLifetimePlan(plan?: string | null, status?: string | null) {
  return getBillingPlanKey(plan, status) === 'lifetime';
}
