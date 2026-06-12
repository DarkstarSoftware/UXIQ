'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function UpgradeButton({ label = 'Upgrade to Pro' }: { label?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data = await response.json().catch(() => null);
      alert(data?.error || 'Unable to open Stripe Checkout.');
    } catch {
      alert('Unable to open Stripe Checkout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" onClick={handleClick} disabled={loading} className="w-full">
      {loading ? 'Opening Stripe...' : label}
    </Button>
  );
}