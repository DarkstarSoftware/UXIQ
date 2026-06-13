import Link from 'next/link';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { UpgradeButton } from '@/components/billing/upgrade-button';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic audit insights for quick validation.',
    features: [
      'Account required',
      'Overall website score',
      'Basic Nielsen Norman references',
      'Basic WCAG-aware observations',
      'Top findings',
      'Limited reports',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29/mo',
    description: 'Full AI-powered UX, accessibility, and conversion reports.',
    features: [
      'Full AI audit',
      'WCAG 2.2 AA-oriented analysis',
      'Conversion recommendations',
      'Impact and effort ratings',
      'Saved audit history',
      'Competitor insights',
      'PDF-ready exports',
      'Roadmap generator',
    ],
    featured: true,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-ui-bg text-white">
      <div className="container-shell py-8">
        <header className="flex items-center justify-between">
          <Logo />
          <Link href="/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </header>

        <section className="py-16 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Pricing</p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Start free. Upgrade when you need full AI intelligence.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-ui-muted">
            Free users get basic UX and WCAG-aware findings. Pro users unlock the full AI UX Insight engine.
          </p>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card p-8 text-left ${tier.featured ? 'border-brand-500' : ''}`}
              >
                <p className="text-xl font-semibold">{tier.name}</p>
                <p className="mt-3 text-sm text-ui-muted">{tier.description}</p>
                <p className="mt-6 text-5xl font-semibold text-white">{tier.price}</p>

                <div className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-ui-muted">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </div>
                  ))}
                </div>

                {tier.featured ? (
                  <div className="mt-8">
                    <UpgradeButton label="Start Pro Checkout" />
                  </div>
                ) : (
                  <Link href="/auth/signup">
                    <Button variant="secondary" className="mt-8 w-full">
                      Get Started Free
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
