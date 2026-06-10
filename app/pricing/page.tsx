import Link from 'next/link';
import { Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

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
      'Limited recommendations',
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
      'Conversion friction recommendations',
      'Impact and effort ratings',
      'Saved audit history',
      'Competitor insights',
    ],
    featured: true,
  },
  {
    name: 'Expert',
    price: '$199+',
    description: 'Manual expert UX review by Darkstar Software.',
    features: [
      'Human UX review',
      'Executive-level findings',
      'Prioritized fix roadmap',
      'Optional redesign guidance',
    ],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-ui-bg text-white">
      <div className="container-shell py-8">
        <header className="flex items-center justify-between">
          <Logo />
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </header>

        <section className="py-16 text-center">
          <p className="text-sm uppercase tracking-[0.22em] text-brand-500">Pricing</p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Start free. Upgrade when you need full AI intelligence.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-ui-muted">
            Free users receive basic Nielsen Norman + WCAG-aware findings.
            Pro users unlock the complete Darkstar Audit AI engine.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card p-8 text-left ${
                  tier.featured ? 'border-brand-500/50 ring-1 ring-brand-500/30' : ''
                }`}
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

                <Link href={tier.featured ? '/auth/signup?plan=pro' : '/auth/signup'}>
                  <Button
                    className="mt-8 w-full"
                    variant={tier.featured ? 'primary' : 'secondary'}
                  >
                    {tier.featured ? 'Start Pro' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
