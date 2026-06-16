import { CheckCircle2, CreditCard, Sparkles } from 'lucide-react';

import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import {
  getBillingPlanDescription,
  getBillingPlanLabel,
  getBillingPlanPrice,
  isLifetimePlan,
  isPaidPlan,
} from '@/lib/billing-plan';

type BillingCardProps = {
  plan?: string | null;
  status?: string | null;
  periodEnd?: string | null;
  stripeCustomerId?: string | null;
  compact?: boolean;
};

const proFeatures = [
  'Unlimited UX audits',
  'Saved report history',
  'Roadmap generation',
  'Competitor analysis',
  'PDF exports',
  'AI-powered recommendations',
];

function formatDate(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function FeatureList() {
  return (
    <div className="premium-feature-list">
      {proFeatures.map((feature) => (
        <div key={feature} className="premium-feature-item">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
}

export function BillingCard({
  plan,
  status,
  periodEnd,
  stripeCustomerId,
  compact,
}: BillingCardProps) {
  const planLabel = getBillingPlanLabel(plan, status);
  const planPrice = getBillingPlanPrice(plan, status);
  const planDescription = getBillingPlanDescription(plan, status);
  const lifetime = isLifetimePlan(plan, status);
  const paidPlan = isPaidPlan(plan, status);
  const formattedPeriodEnd = formatDate(periodEnd);
  const canManageBilling = paidPlan && !lifetime && Boolean(stripeCustomerId);

  if (paidPlan) {
    return (
      <section className="card app-section premium-billing-card">
        <div className="premium-billing-paid">
          <div>
            <p className="app-kicker">Subscription</p>
            <h2 className="premium-billing-title">{planLabel}</h2>
            <p className="premium-billing-price">{planPrice}</p>
            <p className="premium-billing-copy">{planDescription}</p>

            {formattedPeriodEnd && canManageBilling ? (
              <p className="premium-billing-note">
                Current billing period ends {formattedPeriodEnd}.
              </p>
            ) : null}
          </div>

          <div className="premium-billing-action-card">
            <div className="premium-billing-icon">
              <CreditCard className="h-5 w-5" aria-hidden="true" />
            </div>

            {lifetime ? (
              <>
                <p className="issue-row-title">Lifetime access is active</p>
                <p className="mt-2 app-muted">No recurring billing. Future product updates are included.</p>
              </>
            ) : canManageBilling ? (
              <>
                <p className="issue-row-title">Manage your subscription</p>
                <p className="mt-2 app-muted">Update payment method, view invoices, or cancel in Stripe.</p>
                <form action="/api/stripe/portal" method="POST" className="mt-5">
                  <input type="hidden" name="intent" value="manage" />
                  <Button type="submit" className="w-full">Manage Billing</Button>
                </form>
              </>
            ) : (
              <>
                <p className="issue-row-title">Billing portal unavailable</p>
                <p className="mt-2 app-muted">Stripe customer not found for this account.</p>
              </>
            )}
          </div>
        </div>

        {!compact ? (
          <div className="premium-plan-includes">
            <h3>Included with your plan</h3>
            <FeatureList />
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="card app-section premium-billing-card">
      <div className="premium-billing-header">
        <div>
          <p className="app-kicker">Subscription</p>
          <h2 className="premium-billing-title">Upgrade Your UX Intelligence</h2>
          <p className="premium-billing-copy">
            Unlock full AI-powered audits, roadmaps, competitor analysis, PDF exports, and advanced recommendations.
          </p>
        </div>
        <span className="badge badge-low">Free</span>
      </div>

      <div className="premium-upgrade-layout">
        <article className="premium-upgrade-primary">
          <div className="premium-plan-badge-row">
            <span className="premium-plan-badge">Recommended</span>
            <span className="status-pill">Best value</span>
          </div>

          <h3>$99.99<span>/yr</span></h3>
          <p>Best for ongoing UX optimization. Save compared to monthly billing.</p>

          <FeatureList />

          <div className="premium-upgrade-cta">
            <UpgradeButton label="Start Annual Plan" plan="annual" />
          </div>
        </article>

        <div className="premium-upgrade-secondary">
          <article className="premium-mini-plan">
            <div>
              <p className="mini-label">Monthly</p>
              <h3>$9.99<span>/mo</span></h3>
              <p>Flexible access with no annual commitment.</p>
            </div>
            <UpgradeButton label="Start Monthly" plan="monthly" />
          </article>

          <article className="premium-mini-plan">
            <div>
              <p className="mini-label">Lifetime</p>
              <h3>$299.99</h3>
              <p>Founder access. Pay once and keep access.</p>
            </div>
            <UpgradeButton label="Get Lifetime" plan="lifetime" />
          </article>
        </div>
      </div>

      {!compact ? (
        <div className="premium-billing-proof">
          <Sparkles className="h-5 w-5 text-brand-300" aria-hidden="true" />
          <p>
            AIUX Insight turns audit findings into structured reports, roadmap actions,
            competitor benchmarks, and stakeholder-ready recommendations.
          </p>
        </div>
      ) : null}
    </section>
  );
}
