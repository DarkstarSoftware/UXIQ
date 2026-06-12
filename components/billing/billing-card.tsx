import { Button } from '@/components/ui/button';
import { getBillingStatusLabel, getPlanLabel } from '@/lib/billing';
import { UpgradeButton } from '@/components/billing/upgrade-button';

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

  return (
    <div className="card p-6">
      <h2 className="section-title">Billing</h2>

      <div className="mt-5 rounded-xl border border-ui-border bg-ui-surface/60 p-5">
        <p className="text-sm text-ui-muted">Current Plan</p>
        <p className="mt-2 text-4xl font-semibold text-white">{getPlanLabel(plan)}</p>
        <p className="mt-2 text-sm text-ui-muted">
          Status: {getBillingStatusLabel(status)}
        </p>

        {periodEnd ? (
          <p className="mt-1 text-sm text-ui-muted">
            Renews/ends: {new Date(periodEnd).toLocaleDateString()}
          </p>
        ) : null}
      </div>

      {isPro ? (
        <form action="/api/stripe/portal" method="POST">
          <Button className="mt-5 w-full">Manage Billing</Button>
        </form>
      ) : (
       <div className="mt-5">
  <UpgradeButton />
</div>
      )}
    </div>
  );
}
