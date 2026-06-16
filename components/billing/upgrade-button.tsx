import { Button } from '@/components/ui/button';

export type CheckoutPlan = 'monthly' | 'annual' | 'lifetime';

type UpgradeButtonProps = {
  label?: string;
  plan?: CheckoutPlan;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function UpgradeButton({
  label = 'Upgrade to Pro',
  plan = 'monthly',
  className,
  variant = 'primary',
}: UpgradeButtonProps) {
  return (
    <form action="/api/stripe/checkout" method="POST" className={className}>
      <input type="hidden" name="plan" value={plan} />

      <Button type="submit" variant={variant} className="w-full">
        {label}
      </Button>
    </form>
  );
}