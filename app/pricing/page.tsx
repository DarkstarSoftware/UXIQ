import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';

import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase/server';

const freeFeatures = [
  'Basic UX score',
  'Top usability findings',
  'Basic WCAG-aware observations',
  'One quick audit summary',
];

const proFeatures = [
  'Full AI-powered UX audit',
  'WCAG 2.2 AA-oriented accessibility review',
  'Conversion recommendations',
  'Impact and effort ratings',
  'Saved audit history',
  'Competitor comparison',
  'Roadmap generator',
  'Client-ready report views',
];

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
            <Link href="/dashboard">
              <Button variant="secondary">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="premium-shell premium-section">
        <div className="premium-section-heading centered">
          <p className="premium-eyebrow">Pricing</p>
          <h1 className="text-5xl font-semibold tracking-tight text-white">
            Start free. Upgrade when you need full AI intelligence.
          </h1>
          <p>
            Free users get basic UX, WCAG, and Nielsen Norman heuristic checks. Pro users unlock
            AI-powered findings, saved reports, roadmaps, competitor analysis, and PDF exports.
          </p>
        </div>

        <div className="premium-plan-grid">
          <article className="premium-plan-card">
            <p className="mini-label">Free</p>
            <h3>$0</h3>
            <p>Basic audit insights for quick validation.</p>

            <ul>
              {freeFeatures.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 aria-hidden="true" /> {feature}
                </li>
              ))}
            </ul>

            <Link href="/auth/signup">
              <Button variant="secondary" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </article>

          <article className="premium-plan-card">
            <div className="plan-card-topline">
              <p className="mini-label">Pro Monthly</p>
              <span className="status-pill">Most flexible</span>
            </div>

            <h3>$9.99/mo</h3>
            <p>Full AI-powered UX, accessibility, and conversion reports.</p>

            <ul>
              {proFeatures.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 aria-hidden="true" /> {feature}
                </li>
              ))}
            </ul>

            <UpgradeButton label="Start Monthly" plan="monthly" />
          </article>

          <article className="premium-plan-card featured">
            <div className="plan-card-topline">
              <p className="mini-label">Pro Annual</p>
              <span className="status-pill">Best value</span>
            </div>

            <h3>$99.99/yr</h3>
            <p>Save with annual billing and unlock the full Pro workflow.</p>

            <ul>
              {proFeatures.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 aria-hidden="true" /> {feature}
                </li>
              ))}
              <li>
                <CheckCircle2 aria-hidden="true" /> Best value for ongoing UX optimization
              </li>
            </ul>

            <UpgradeButton label="Start Annual" plan="annual" />
          </article>

          <article className="premium-plan-card">
            <div className="plan-card-topline">
              <p className="mini-label">Lifetime</p>
              <span className="status-pill">Founder&apos;s deal</span>
            </div>

            <h3>$299.99</h3>
            <p>Pay once and keep access to AIUX Insight forever.</p>

            <ul>
              {proFeatures.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 aria-hidden="true" /> {feature}
                </li>
              ))}
              <li>
                <CheckCircle2 aria-hidden="true" /> Lifetime product updates
              </li>
            </ul>

            <UpgradeButton label="Get Lifetime Access" plan="lifetime" />
          </article>
        </div>
      </section>
    </main>
  );
}
