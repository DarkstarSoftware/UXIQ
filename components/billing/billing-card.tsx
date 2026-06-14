import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';

type BillingCardProps = {
  plan?: string | null;
  status?: string | null;
  periodEnd?: string | null;
  compact?: boolean;
};

export function BillingCard({ plan, status, periodEnd, compact }: BillingCardProps) {
  const isLifetime = status === 'lifetime' || plan === 'pro_lifetime';
  const isPro = plan === 'pro' || isLifetime || status === 'active' || status === 'trialing';
  const isPaidStripeUser = isPro && !isLifetime;

  return (
    <section className="card app-section">
      <div className="app-toolbar">
        <div>
          <p className="app-kicker">Billing</p>
          <h2 className="section-title">Subscription</h2>
        </div>

        <span className={isPro ? 'badge badge-pro' : 'badge badge-low'}>
          {isLifetime ? 'Pro Lifetime' : isPro ? 'Pro' : 'Free'}
        </span>
      </div>

      <div className={compact ? 'settings-stack' : 'billing-hero'}>
        <div>
          <p className="app-muted">Current plan</p>

          <p className="billing-plan-name">
            {isLifetime ? 'Pro Lifetime' : isPro ? 'Pro' : 'Free'}
          </p>

          <p className="mt-3 app-muted">
            {isLifetime
              ? 'You have lifetime access to AIUX Insight. No billing actions are required.'
              : isPro
                ? 'Your Pro subscription is active.'
                : 'Upgrade to Pro to unlock AI-powered audits, saved reports, roadmaps, and deeper recommendations.'}
          </p>

          {periodEnd && isPaidStripeUser ? (
            <p className="mt-2 app-muted">
              Current billing period ends {new Date(periodEnd).toLocaleDateString()}.
            </p>
          ) : null}
        </div>

        <div className="billing-actions">
          {isLifetime ? (
            <div className="rounded-xl border border-brand-500 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
              Lifetime access is active.
            </div>
          ) : isPaidStripeUser ? (
            <form action="/api/stripe/portal" method="POST">
              <input type="hidden" name="intent" value="manage" />
              <Button type="submit" className="w-full">
                Manage Billing
              </Button>
            </form>
          ) : (
            <UpgradeButton label="Start Pro Checkout" />
          )}
        </div>
      </div>
    </section>
  );
}