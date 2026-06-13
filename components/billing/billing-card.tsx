import { Button } from '@/components/ui/button';
import { UpgradeButton } from '@/components/billing/upgrade-button';
import { getBillingStatusLabel, getPlanLabel } from '@/lib/billing';

export function BillingCard({
  plan,
  status,
  periodEnd,
}: {
  plan?: string | null;
  status?: string | null;
  periodEnd?: string | null;
}) {
  const isPro = plan === 'pro';
  const isLifetime = status === 'lifetime';

  return (
    <div className="card p-6">
      <h2 className="section-title">Billing</h2>

      <div className="mt-5 rounded-xl border border-ui-border bg-ui-surface/60 p-5">
        <p className="text-sm text-ui-muted">Current Plan</p>
        <p className="mt-2 text-4xl font-semibold text-white">{getPlanLabel(plan)}</p>
        <p className="mt-2 text-sm text-ui-muted">
          Status: {isLifetime ? 'Lifetime access' : getBillingStatusLabel(status)}
        </p>

        {periodEnd && !isLifetime ? (
          <p className="mt-1 text-sm text-ui-muted">
            Renews/ends: {new Date(periodEnd).toLocaleDateString()}
          </p>
        ) : null}
      </div>

      {isLifetime ? (
        <p className="mt-5 rounded-xl border border-brand-500 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
          Lifetime Pro access is active for this account.
        </p>
      ) : isPro ? (
        <form action="/api/stripe/portal" method="POST">
          <Button className="mt-5 w-full">Manage Billing</Button>
        </form>
      ) : (
        <div className="mt-5">
          <UpgradeButton label="Start Pro Checkout" />
        </div>
      )}
    </div>
  );
}
