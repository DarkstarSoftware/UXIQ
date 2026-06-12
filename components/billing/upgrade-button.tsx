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

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error || 'Unable to open Stripe Checkout.');
        setLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      alert('Stripe Checkout URL was not returned.');
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