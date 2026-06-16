import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import {
  getBillingPlanDescription,
  getBillingPlanKey,
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
  'Unlimited real UX audits',
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

function PlanFeatureList() {
  return (
    <ul className="plan-feature-list">
      {proFeatures.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
  );
}

export function BillingCard({
  plan,
  status,
  periodEnd,
  stripeCustomerId,
  compact,
}: BillingCardProps) {
  const planKey = getBillingPlanKey(plan, status);
  const planLabel = getBillingPlanLabel(plan, status);
  const planPrice = getBillingPlanPrice(plan, status);
  const planDescription = getBillingPlanDescription(plan, status);
  const lifetime = isLifetimePlan(plan, status);
  const paidPlan = isPaidPlan(plan, status);
  const isStripeSubscription = paidPlan && !lifetime && Boolean(stripeCustomerId);
  const formattedPeriodEnd = formatDate(periodEnd);

  if (paidPlan) {
    return (
      <section className="card app-section">
        <div className="app-toolbar">
          <div>
            <p className="app-kicker">Subscription</p>
            <h2 className="section-title">Plan & Billing</h2>
          </div>
          <span className="badge badge-pro">{planLabel}</span>
        </div>

        <div className={compact ? 'settings-stack' : 'billing-hero'}>
          <div>
            <p className="app-muted">Current plan</p>
            <p className="billing-plan-name">{planLabel}</p>
            <p className="mt-2 app-muted">{planPrice}</p>
            <p className="mt-3 app-muted">{planDescription}</p>

            {formattedPeriodEnd && isStripeSubscription ? (
              <p className="mt-3 app-muted">Current billing period ends {formattedPeriodEnd}.</p>
            ) : null}

            <div className="mt-6 plan-features">
              <PlanFeatureList />
            </div>
          </div>

          <div className="billing-actions">
            {lifetime ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="issue-row-title">Lifetime access active</p>
                <p className="mt-2 app-muted">No recurring billing. Future product updates are included.</p>
              </div>
            ) : isStripeSubscription ? (
              <form action="/api/stripe/portal" method="POST">
                <input type="hidden" name="intent" value="manage" />
                <Button type="submit" className="w-full">
                  Manage Billing
                </Button>
              </form>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="issue-row-title">Billing portal unavailable</p>
                <p className="mt-2 app-muted">Stripe customer not found for this account.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="card app-section">
      <div className="app-toolbar">
        <div>
          <p className="app-kicker">Subscription</p>
          <h2 className="section-title">Upgrade Your UX Intelligence</h2>
          <p className="mt-2 app-muted">
            Unlock AI-powered audits, roadmaps, competitor analysis, PDF exports, and advanced recommendations.
          </p>
        </div>
        <span className="badge badge-low">Free</span>
      </div>

      <div className="mt-6 billing-upgrade-featured">
        <div className="premium-plan-card featured">
          <div className="plan-card-topline">
            <p className="mini-label">Recommended</p>
            <span className="status-pill">Best value</span>
          </div>

          <h3>$99.99/yr</h3>
          <p>Best for ongoing UX optimization. Save compared to monthly billing.</p>

          <div className="mt-5 plan-features">
            <PlanFeatureList />
          </div>

          <div className="mt-6">
            <UpgradeButton label="Start Annual Plan" plan="annual" />
          </div>
        </div>

        <div className="billing-secondary-plans">
          <div className="score-metric-card">
            <span>Monthly</span>
            <strong>$9.99</strong>
            <p className="mt-2 app-muted">Flexible access.</p>
            <div className="mt-4">
              <UpgradeButton label="Start Monthly" plan="monthly" />
            </div>
          </div>

          <div className="score-metric-card">
            <span>Lifetime</span>
            <strong>$299.99</strong>
            <p className="mt-2 app-muted">Founder access. Pay once.</p>
            <div className="mt-4">
              <UpgradeButton label="Get Lifetime" plan="lifetime" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
