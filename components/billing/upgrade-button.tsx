import { Button } from '@/components/ui/button';

export type CheckoutPlan = 'monthly' | 'annual' | 'lifetime';

type UpgradeButtonProps = {
  label?: string;
  plan?: CheckoutPlan;
  className?: string;
};

export function UpgradeButton({
  label = 'Upgrade to Pro',
  plan = 'monthly',
  className,
}: UpgradeButtonProps) {
  return (
    <form action="/api/stripe/checkout" method="POST" className={className}>
      <input type="hidden" name="plan" value={plan} />

      <Button type="submit" className="w-full">
        {label}
      </Button>
    </form>
  );
}
