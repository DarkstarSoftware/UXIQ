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
        credentials: 'include',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        alert(data?.error || 'Unable to open Stripe Checkout.');
        setLoading(false);
        return;
      }

      if (!data?.url) {
        alert('Stripe Checkout URL was not returned.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to open Stripe Checkout.');
      setLoading(false);
    }
  }

  return (
    <Button type="button" onClick={handleClick} disabled={loading} className="w-full">
      {loading ? 'Opening Stripe...' : label}
    </Button>
  );
}
