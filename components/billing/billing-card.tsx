import { Button } from '@/components/ui/button';
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
  const planLabel = getPlanLabel(plan);
  const statusLabel = getBillingStatusLabel(status);

  return (
    <div className="card p-6">
      <h2 className="section-title">Billing</h2>

      <div className="mt-5 rounded-xl border border-ui-border bg-ui-surface/60 p-5">
        <p className="text-sm text-ui-muted">Current Plan</p>
        <p className="mt-2 text-4xl font-semibold text-white">{planLabel}</p>
        <p className="mt-2 text-sm text-ui-muted">Status: {statusLabel}</p>

        {periodEnd ? (
          <p className="mt-1 text-sm text-ui-muted">
            Current period ends: {new Date(periodEnd).toLocaleDateString()}
          </p>
        ) : null}
      </div>

      {plan === 'pro' ? (
        <form action="/api/stripe/portal" method="POST">
          <Button className="mt-5 w-full">Manage Billing</Button>
        </form>
      ) : (
        <form action="/api/stripe/checkout" method="POST">
          <Button className="mt-5 w-full">Upgrade to Pro</Button>
        </form>
      )}
    </div>
  );
}
