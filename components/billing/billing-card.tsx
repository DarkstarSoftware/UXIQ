import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';

type BillingCardProps = {
  plan?: string | null;
  status?: string | null;
  periodEnd?: string | null;
  stripeCustomerId?: string | null;
  compact?: boolean;
};

export function BillingCard({ plan, status, periodEnd, stripeCustomerId, compact }: BillingCardProps) {
  const isLifetime = status === 'lifetime' || plan === 'pro_lifetime';
  const isPro = plan === 'pro' || isLifetime || status === 'active' || status === 'trialing';
  const isPaidStripeUser = isPro && !isLifetime && Boolean(stripeCustomerId);

  return (
    <section className="card app-section">
      <div className="app-toolbar">
        <div>
          <p className="app-kicker">Subscription</p>
          <h2 className="section-title">Plan & Billing</h2>
        </div>
        <span className={isPro ? 'badge badge-pro' : 'badge badge-low'}>
          {isLifetime ? 'Pro Lifetime' : isPro ? 'Pro' : 'Free'}
        </span>
      </div>

      <div className={compact ? 'settings-stack' : 'billing-hero'}>
        <div>
          <p className="app-muted">Current plan</p>
          <p className="billing-plan-name">{isLifetime ? 'Pro Lifetime' : isPro ? 'Pro' : 'Free'}</p>
          <p className="mt-3 app-muted">
            {isLifetime
              ? 'Full access to all AIUX Insight capabilities.'
              : isPro
                ? 'Your Pro subscription is active.'
                : 'Upgrade to Pro to unlock AI-powered audits, competitor analysis, saved roadmaps, and deeper recommendations.'}
          </p>
          {periodEnd && isPaidStripeUser ? (
            <p className="mt-2 app-muted">Current billing period ends {new Date(periodEnd).toLocaleDateString()}.</p>
          ) : null}
        </div>

        <div className="billing-actions">
{isLifetime ? (
  <div className="plan-features">
    <ul className="plan-feature-list">
      <li>Unlimited UX audits</li>
      <li>Unlimited reports</li>
      <li>Unlimited roadmaps</li>
      <li>Unlimited competitor analysis</li>
      <li>Advanced AI recommendations</li>
    </ul>
  </div>
)          
 : isPaidStripeUser ? (
            <form action="/api/stripe/portal" method="POST">
              <input type="hidden" name="intent" value="manage" />
              <Button type="submit" className="w-full">Manage Billing</Button>
            </form>
          ) : isPro ? (
            <div className="rounded-xl border border-ui-border px-4 py-3 text-sm text-ui-muted">
              Stripe customer not found. Contact support if billing management is needed.
            </div>
          ) : (
            <UpgradeButton label="Start Pro Checkout" />
          )}
        </div>
      </div>
    </section>
  );
}
