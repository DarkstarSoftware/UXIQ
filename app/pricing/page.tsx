import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const freeFeatures = ['Account required', 'Overall website score', 'Basic heuristic references', 'Basic WCAG-aware observations', 'Top findings'];
const proFeatures = ['Full AI-powered audit', 'WCAG 2.2 AA-oriented accessibility review', 'Conversion recommendations', 'Impact and effort ratings', 'Saved audit history', 'Competitor insights', 'PDF-ready exports', 'AI roadmap generator'];

export default function PricingPage() {
  return (
    <main className="ai-page">
      <header className="ai-header">
        <div className="container-shell ai-header-inner">
          <Logo />
          <Link href="/dashboard"><Button variant="secondary">Dashboard</Button></Link>
        </div>
      </header>

      <section className="container-shell ai-section">
        <div className="ai-section-heading ai-center">
          <p className="ai-kicker">Pricing</p>
          <h1 className="ai-title">Start free. Upgrade when you need full AI intelligence.</h1>
          <p>Free users get basic UX and WCAG-aware findings. Pro users unlock the full AI UX Insight engine.</p>
        </div>

        <div className="ai-plan-grid">
          <article className="card ai-plan-card">
            <p className="ai-plan-label">Free</p>
            <h3>$0</h3>
            <p>Basic audit insights for quick validation.</p>
            <div className="ai-check-list">
              {freeFeatures.map((feature) => <div key={feature} className="ai-check-row"><CheckCircle2 className="ai-check-icon" aria-hidden="true" /><span>{feature}</span></div>)}
            </div>
            <Link href="/auth/signup"><Button variant="secondary" className="w-full">Get Started Free</Button></Link>
          </article>

          <article className="card ai-plan-card ai-plan-pro">
            <p className="ai-plan-label">Pro</p>
            <h3>$29/mo</h3>
            <p>Full AI-powered UX, accessibility, and conversion reports.</p>
            <div className="ai-check-list">
              {proFeatures.map((feature) => <div key={feature} className="ai-check-row"><CheckCircle2 className="ai-check-icon" aria-hidden="true" /><span>{feature}</span></div>)}
            </div>
            <UpgradeButton label="Start Pro Checkout" />
          </article>
        </div>
      </section>
    </main>
  );
}
