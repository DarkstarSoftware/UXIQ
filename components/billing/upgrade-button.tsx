import { Button } from '@/components/ui/button';

export function UpgradeButton({ label = 'Upgrade to Pro' }: { label?: string }) {
  return (
    <form action="/api/stripe/checkout" method="POST">
      <Button type="submit" className="w-full">
        {label}
      </Button>
    </form>
  );
}
