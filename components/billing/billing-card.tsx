import { Button } from '@/components/ui/button';
import { UpgradeButton } from '@/components/billing/upgrade-button';
import { getBillingStatusLabel, getPlanLabel } from '@/lib/billing';

export function BillingCard({
  plan,
  status,
  periodEnd,
  compact = false,
}: {
  plan?: string | null;
  status?: string | null;
  periodEnd?: string | null;
  compact?: boolean;
}) {
  const isPro = plan === 'pro';
  const isLifetime = status === 'lifetime';

  return (
    <section className="card app-section">
      <div className="app-toolbar">
        <div>
          <p className="app-kicker">Billing</p>
          <h2 className="section-title">Subscription</h2>
        </div>
        {isPro ? <span className="badge badge-pro">Pro</span> : <span className="badge badge-low">Free</span>}
      </div>

      <div className={compact ? '' : 'billing-hero'}>
        <div>
          <p className="app-muted">Current plan</p>
          <p className="billing-plan-name">{getPlanLabel(plan)}</p>
          <p className="mt-3 app-muted">
            Status: {isLifetime ? 'Lifetime access' : getBillingStatusLabel(status)}
          </p>

          {periodEnd && !isLifetime ? (
            <p className="app-muted">
              Renews/ends: {new Date(periodEnd).toLocaleDateString()}
            </p>
          ) : null}

          {isLifetime ? (
            <p className="mt-5 rounded-xl border border-brand-500 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
              Lifetime Pro access is active for this account.
            </p>
          ) : null}
        </div>

        <div className="billing-actions">
          {isPro ? (
            <>
              <form action="/api/stripe/portal" method="POST">
                <input type="hidden" name="intent" value="manage" />
                <Button className="w-full">Manage Billing</Button>
              </form>

              {!isLifetime ? (
                <form action="/api/stripe/portal" method="POST">
                  <input type="hidden" name="intent" value="cancel" />
                  <Button variant="danger" className="w-full">Cancel Subscription</Button>
                </form>
              ) : null}
            </>
          ) : (
            <UpgradeButton label="Start Pro Checkout" />
          )}
        </div>
      </div>
    </section>
  );
}
