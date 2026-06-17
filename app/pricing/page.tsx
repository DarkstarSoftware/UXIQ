import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2, Minus, Sparkles } from 'lucide-react';

import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/server';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    description: 'Basic validation for trying AIUX Insight.',
    badge: null,
    featured: false,
    cta: 'Get Started Free',
    highlights: ['Basic UX score', 'WCAG-aware checks', 'Nielsen heuristic review'],
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '$9.99',
    period: '/mo',
    description: 'Flexible access to the full product.',
    badge: 'Most flexible',
    featured: false,
    cta: 'Start Monthly',
    highlights: ['Unlimited audits', 'Roadmaps', 'Competitor analysis'],
  },
  {
    id: 'annual',
    name: 'Pro Annual',
    price: '$99.99',
    period: '/yr',
    description: 'Best value for ongoing UX optimization.',
    badge: 'Most popular',
    featured: true,
    cta: 'Start Annual',
    highlights: ['Everything in Pro', 'Best annual value', 'Great for ongoing audits'],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$299.99',
    period: '',
    description: 'Founder access with no recurring payment.',
    badge: 'Founder Deal',
    featured: false,
    cta: 'Get Lifetime',
    highlights: ['Everything in Pro', 'Pay once', 'Future updates included'],
  },
] as const;

const featureRows = [
  ['Real UX audits', true, true, true, true],
  ['WCAG-aware checks', true, true, true, true],
  ['Nielsen Norman heuristics', true, true, true, true],
  ['Saved report history', false, true, true, true],
  ['Roadmap generation', false, true, true, true],
  ['Competitor analysis', false, true, true, true],
  ['PDF exports', false, true, true, true],
  ['AI-powered recommendations', false, true, true, true],
];

function PlanButton({ plan }: { plan: typeof plans[number] }) {
  if (plan.id === 'free') {
    return (
      <Link href="/auth/signup" className="pricing-card-button">
        <Button variant="secondary" className="w-full">
          Get Started Free
        </Button>
      </Link>
    );
  }

  return (
    <UpgradeButton
      label={plan.cta}
      plan={plan.id}
      className="pricing-card-button"
    />
  );
}

function FeatureValue({ value }: { value: boolean }) {
  return value ? (
    <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
  ) : (
    <Minus className="h-5 w-5 text-slate-500" aria-hidden="true" />
  );
}

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, subscription_status')
      .eq('id', user.id)
      .single();

    const isPro =
      profile?.plan === 'pro' ||
      profile?.plan === 'pro_annual' ||
      profile?.plan === 'pro_lifetime' ||
      profile?.subscription_status === 'active' ||
      profile?.subscription_status === 'trialing' ||
      profile?.subscription_status === 'lifetime';

    if (isPro) redirect('/billing');
  }

  return (
    <main className="premium-page">
      <header className="premium-nav">
        <div className="premium-shell premium-nav-inner">
          <Logo href="/" />
          <nav className="premium-nav-links" aria-label="Pricing navigation">
            <Link href="/auth/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="premium-shell premium-section premium-pricing-shell">
        <div className="premium-section-heading centered premium-pricing-hero">
          <p className="premium-eyebrow">Pricing</p>
          <h1 className="text-5xl font-semibold tracking-tight text-white">
            UX audits without agency pricing.
          </h1>
          <p>
            Most UX audits cost thousands. AIUX Insight helps you find accessibility,
            usability, conversion, and competitor opportunities starting at $9.99/month.
          </p>
        </div>

        <div className="premium-pricing-grid">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={plan.featured ? 'premium-pricing-card featured' : 'premium-pricing-card'}
            >
              <div className="pricing-card-content">
                <div className="plan-card-topline">
                  <p className="mini-label">{plan.name}</p>
                  {plan.badge ? <span className="status-pill">{plan.badge}</span> : null}
                </div>

                <div className="premium-pricing-price">
                  <span>{plan.price}</span>
                  {plan.period ? <small>{plan.period}</small> : null}
                </div>

                <p className="premium-pricing-copy">{plan.description}</p>

                <ul className="pricing-card-highlights">
                  {plan.highlights.map((item) => (
                    <li key={item}>
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {plan.featured ? (
                  <div className="premium-pricing-callout">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    <span>Best for founders, consultants, and product teams running ongoing audits.</span>
                  </div>
                ) : null}
              </div>

              <PlanButton plan={plan} />
            </article>
          ))}
        </div>

        <section className="card app-section premium-pricing-comparison">
          <div className="premium-section-heading">
            <p className="premium-eyebrow">Compare Plans</p>
            <h2 className="section-title">Choose the plan that fits your workflow.</h2>
            <p className="app-muted">
              Free is for quick validation. Pro unlocks the full audit-to-roadmap-to-report workflow.
            </p>
          </div>

          <div className="premium-pricing-table">
            <div className="premium-pricing-table-row premium-pricing-table-head">
              <div>Feature</div>
              <div>Free</div>
              <div>Monthly</div>
              <div>Annual</div>
              <div>Lifetime</div>
            </div>

            {featureRows.map(([feature, free, monthly, annual, lifetime]) => (
              <div key={feature as string} className="premium-pricing-table-row">
                <div>{feature}</div>
                <div><FeatureValue value={Boolean(free)} /></div>
                <div><FeatureValue value={Boolean(monthly)} /></div>
                <div><FeatureValue value={Boolean(annual)} /></div>
                <div><FeatureValue value={Boolean(lifetime)} /></div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
