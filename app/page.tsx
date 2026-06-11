import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const features = [
  {
    icon: CheckCircle2,
    title: 'Nielsen Norman usability review',
    body: 'Evaluate clarity, consistency, error prevention, feedback, and user control.',
  },
  {
    icon: ShieldCheck,
    title: 'WCAG accessibility checks',
    body: 'Surface issues with contrast, headings, labels, alt text, focus states, and forms.',
  },
  {
    icon: TrendingUp,
    title: 'Conversion friction analysis',
    body: 'Find weak CTAs, confusing hierarchy, form friction, and unclear next steps.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered Pro reports',
    body: 'Unlock deeper AI recommendations, priority fixes, and saved report history.',
  },
];

const freeItems = [
  'Overall UX score',
  'Basic Nielsen Norman references',
  'Basic WCAG-aware observations',
  'Top findings',
];

const proItems = [
  'Full AI-powered audit',
  'WCAG 2.2 AA-oriented review',
  'Conversion recommendations',
  'Impact and effort ratings',
  'Saved audit history',
  'Competitor insights',
];

export default function HomePage() {
  return (
    <main className="ds-page">
      <header className="ds-header">
        <div className="ds-shell ds-header-inner">
          <Logo />

          <div className="ds-header-actions">
            <Link href="/auth/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Create Account</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="ds-shell ds-hero">
        <div className="ds-hero-copy">
          <p className="ds-kicker">
            AI-Powered UX, Accessibility & Conversion Intelligence
          </p>

          <h1 className="ds-hero-title">
            See your website through the eyes of UX experts and AI.
          </h1>

          <p className="ds-hero-subtitle">
            Darkstar Audit AI helps teams uncover usability issues, WCAG compliance gaps,
            accessibility barriers, and conversion friction before those problems cost customers.
          </p>

          <div className="ds-action-row">
            <Link href="/auth/signup">
              <Button>
                Start Free Audit <ArrowRight className="ds-icon-sm" />
              </Button>
            </Link>

            <Link href="/pricing">
              <Button variant="secondary">Compare Plans</Button>
            </Link>
          </div>

          <div className="ds-lock-note">
            <Lock className="ds-icon-sm" />
            Sign in required before running an audit.
          </div>
        </div>

        <div className="ds-preview-card">
          <div className="ds-preview-top">
            <span>Sample audit preview</span>
            <span className="ds-pill">Free Preview</span>
          </div>

          <div className="ds-score-block">
            <div>
              <p className="ds-score">72</p>
              <p className="ds-score-label">Good, but losing conversions</p>
            </div>

            <span className="ds-pill ds-pill-warning">WCAG notes</span>
          </div>

          <div className="ds-preview-list">
            {[
              'CTA hierarchy needs improvement',
              'Form labels require accessibility review',
              'Hero section lacks one dominant next step',
            ].map((item) => (
              <div key={item} className="ds-preview-item">
                {item}
              </div>
            ))}
          </div>

          <div className="ds-unlock-box">
            <p>Upgrade unlocks:</p>
            <span>
              Full AI recommendations, prioritized fixes, saved reports, and competitor insights.
            </span>
          </div>
        </div>
      </section>

      <section className="ds-shell ds-section">
        <div className="ds-section-heading">
          <p className="ds-kicker">What Darkstar Audit AI Reviews</p>
          <h2>Built around the issues that impact trust, accessibility, and conversion.</h2>
        </div>

        <div className="ds-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="ds-card ds-feature-card">
                <Icon className="ds-icon-lg" />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="ds-plan-section">
        <div className="ds-shell">
          <div className="ds-section-heading ds-center">
            <p className="ds-kicker">Free vs Pro</p>
            <h2>Start with basic guidance. Upgrade for full AI intelligence.</h2>
            <p>
              Free users receive basic heuristic and WCAG-aware findings. Pro users receive
              full AI-powered analysis.
            </p>
          </div>

          <div className="ds-plan-grid">
            <div className="ds-card ds-plan-card">
              <p className="ds-plan-label">Free</p>
              <h3>Basic audit summary</h3>
              <p>
                Great for quick validation and understanding obvious UX or accessibility concerns.
              </p>

              <div className="ds-check-list">
                {freeItems.map((item) => (
                  <div key={item} className="ds-check-row">
                    <CheckCircle2 className="ds-check-icon" />
                    {item}
                  </div>
                ))}
              </div>

              <Link href="/auth/signup">
                <Button variant="secondary">Create Free Account</Button>
              </Link>
            </div>

            <div className="ds-card ds-plan-card ds-plan-card-pro">
              <p className="ds-plan-label ds-brand-text">Pro</p>
              <h3>Full AI audit intelligence</h3>
              <p>
                Best for founders, teams, marketers, and agencies that need deeper recommendations.
              </p>

              <div className="ds-check-list">
                {proItems.map((item) => (
                  <div key={item} className="ds-check-row">
                    <CheckCircle2 className="ds-check-icon" />
                    {item}
                  </div>
                ))}
              </div>

              <Link href="/pricing">
                <Button>View Pro Plan</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ds-shell ds-cta-section">
        <div className="ds-card ds-cta-card">
          <p className="ds-kicker">Ready to find the friction?</p>
          <h2>Create an account to run your first Darkstar Audit AI report.</h2>
          <p>
            Start free, then upgrade when you need the full AI-powered UX, WCAG, and conversion report.
          </p>

          <Link href="/auth/signup">
            <Button>Create Account</Button>
          </Link>
        </div>
      </section>

      <footer className="ds-footer">
        <div className="ds-shell ds-footer-inner">
          <p>© 2026 Darkstar Software. Darkstar Audit AI.</p>
          <div>
            <Link href="/pricing">Pricing</Link>
            <Link href="/auth/login">Sign In</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}