import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import {
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
  'Unlimited UX audits',
  'Saved reports',
  'Roadmap generation',
  'Competitor analysis',
  'PDF exports',
  'Advanced AI recommendations',
];

function formatDate(value?: string | null) {
  if (!value) return null;

  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
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
  const lifetime = isLifetimePlan(plan, status);
  const paidPlan = isPaidPlan(plan, status);
  const isStripeSubscription = paidPlan && !lifetime && Boolean(stripeCustomerId);
  const formattedPeriodEnd = formatDate(periodEnd);

  return (
    <section className="card app-section">
      <div className="app-toolbar">
        <div>
          <p className="app-kicker">Subscription</p>
          <h2 className="section-title">Plan & Billing</h2>
        </div>

        <span className={paidPlan ? 'badge badge-pro' : 'badge badge-low'}>
          {planLabel}
        </span>
      </div>

      <div className={compact ? 'settings-stack' : 'billing-hero'}>
        <div>
          <p className="app-muted">Current plan</p>

          <p className="billing-plan-name">{planLabel}</p>

          <p className="mt-2 app-muted">{planPrice}</p>

          <p className="mt-3 app-muted">
            {lifetime
              ? 'You have founder lifetime access with no recurring billing.'
              : paidPlan
                ? `${planLabel} is active. Manage your subscription in the Stripe billing portal.`
                : 'Upgrade to unlock AI-powered audits, roadmaps, competitor analysis, PDF exports, and advanced recommendations.'}
          </p>

          {formattedPeriodEnd && isStripeSubscription ? (
            <p className="mt-2 app-muted">
              Current billing period ends {formattedPeriodEnd}.
            </p>
          ) : null}

          {paidPlan ? (
            <div className="plan-features mt-5">
              <ul className="plan-feature-list">
                {proFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="billing-actions">
          {lifetime ? (
            <div className="plan-features">
              <ul className="plan-feature-list">
                <li>Lifetime access included</li>
                <li>No recurring subscription</li>
                <li>Future product updates included</li>
              </ul>
            </div>
          ) : isStripeSubscription ? (
            <form action="/api/stripe/portal" method="POST">
              <input type="hidden" name="intent" value="manage" />
              <Button type="submit" className="w-full">
                Manage Billing
              </Button>
            </form>
          ) : paidPlan ? (
            <div className="rounded-xl border border-ui-border px-4 py-3 text-sm text-ui-muted">
              Stripe customer not found. Contact support if billing management is needed.
            </div>
          ) : (
            <div className="grid gap-3">
              <UpgradeButton label="Start Monthly — $9.99/mo" plan="monthly" />
              <UpgradeButton label="Start Annual — $99.99/yr" plan="annual" />
<UpgradeButton label="Get Lifetime — $299.99" plan="lifetime" />
            </div>
          )}
        </div>
      </div>

      {!paidPlan ? (
        <div className="mt-6 app-grid-3">
          <div className="score-metric-card">
            <span>Monthly</span>
            <strong>$9.99</strong>
            <p className="mt-2 app-muted">Flexible monthly access.</p>
          </div>

          <div className="score-metric-card">
            <span>Annual</span>
            <strong>$99.99</strong>
            <p className="mt-2 app-muted">Best value for ongoing UX optimization.</p>
          </div>

          <div className="score-metric-card">
            <span>Lifetime</span>
            <strong>$299.99</strong>
            <p className="mt-2 app-muted">Founder access with no recurring payment.</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
