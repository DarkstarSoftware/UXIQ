export function getPlanLabel(plan: string | null | undefined) {
  return plan === 'pro' ? 'Pro' : 'Free';
}

export function isProPlan(plan: string | null | undefined) {
  return plan === 'pro';
}

export function getBillingStatusLabel(status: string | null | undefined) {
  if (!status || status === 'inactive') return 'Inactive';
  if (status === 'active') return 'Active';
  if (status === 'trialing') return 'Trialing';
  if (status === 'lifetime') return 'Lifetime access';
  if (status === 'past_due') return 'Past due';
  if (status === 'canceled') return 'Canceled';
  if (status === 'unpaid') return 'Unpaid';
  return status;
}
