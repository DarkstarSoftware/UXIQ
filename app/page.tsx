import Link from 'next/link';
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

import { UpgradeButton } from '@/components/billing/upgrade-button';
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
    body: 'Surface common barriers around contrast, headings, labels, alt text, focus states, and forms.',
  },
  {
    icon: TrendingUp,
    title: 'Conversion friction analysis',
    body: 'Find weak CTAs, confusing hierarchy, form friction, trust gaps, and unclear next steps.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered Pro recommendations',
    body: 'Unlock deeper AI-generated findings, prioritized fixes, saved reports, and roadmaps.',
  },
];

const freeItems = ['Overall UX score', 'Basic heuristic references', 'Basic WCAG-aware observations', 'Top findings'];
const proItems = ['Full AI-powered audit', 'WCAG 2.2 AA review', 'Conversion recommendations', 'Impact and effort ratings', 'Saved history', 'Competitor insights', 'AI roadmap generator'];

export default function HomePage() {
  return (
    <main className="ai-page">
      <header className="ai-header">
        <div className="container-shell ai-header-inner">
          <Logo />
          <div className="ai-header-actions">
            <Link href="/auth/login"><Button variant="secondary">Sign In</Button></Link>
            <Link href="/auth/signup"><Button>Create Account</Button></Link>
          </div>
        </div>
      </header>

      <section className="container-shell ai-hero">
        <div>
          <p className="ai-kicker">AI-Powered UX, Accessibility & Conversion Intelligence</p>
          <h1 className="ai-title">See your website through the eyes of UX experts and AI.</h1>
          <p className="ai-subtitle">
            AI UX Insight helps teams uncover usability issues, WCAG compliance gaps, accessibility barriers,
            and conversion friction before those problems cost customers.
          </p>

          <div className="ai-action-row">
            <Link href="/auth/signup"><Button>Start Free Audit <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button></Link>
            <Link href="/pricing"><Button variant="secondary">Compare Plans</Button></Link>
          </div>

          <div className="ai-note"><Lock className="h-4 w-4 text-brand-300" aria-hidden="true" /> Sign in required before running an audit.</div>
        </div>

        <aside className="ai-preview" aria-label="Sample audit preview">
          <div className="ai-preview-top">
            <span>Sample audit preview</span>
            <span className="ai-pill">Free Preview</span>
          </div>
          <div className="ai-score-row">
            <div>
              <p className="ai-score">72</p>
              <p className="ai-score-label">Good, but losing conversions</p>
            </div>
            <span className="ai-pill">WCAG notes</span>
          </div>
          <div className="ai-preview-list">
            {['CTA hierarchy needs improvement', 'Form labels require accessibility review', 'Hero section lacks one dominant next step'].map((item) => (
              <div key={item} className="ai-preview-item">{item}</div>
            ))}
          </div>
          <div className="ai-unlock">
            <strong>Upgrade unlocks:</strong>
            <span>Full AI recommendations, prioritized fixes, saved reports, competitor insights, and AI-generated roadmaps.</span>
          </div>
        </aside>
      </section>

      <section className="container-shell ai-section">
        <div className="ai-section-heading">
          <p className="ai-kicker">What AI UX Insight Reviews</p>
          <h2>Built around the issues that impact trust, accessibility, and conversion.</h2>
        </div>
        <div className="ai-feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="card ai-feature-card">
                <Icon className="ai-feature-icon" aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ai-plan-section">
        <div className="container-shell">
          <div className="ai-section-heading ai-center">
            <p className="ai-kicker">Free vs Pro</p>
            <h2>Start with basic guidance. Upgrade for full AI intelligence.</h2>
            <p>Free users receive basic heuristic and WCAG-aware findings. Pro users receive full AI-powered analysis, saved history, exports, and roadmaps.</p>
          </div>
          <div className="ai-plan-grid">
            <article className="card ai-plan-card">
              <p className="ai-plan-label">Free</p>
              <h3>Basic audit summary</h3>
              <p>Great for quick validation and understanding obvious UX or accessibility concerns.</p>
              <div className="ai-check-list">
                {freeItems.map((item) => <div key={item} className="ai-check-row"><CheckCircle2 className="ai-check-icon" aria-hidden="true" /><span>{item}</span></div>)}
              </div>
              <Link href="/auth/signup"><Button variant="secondary" className="w-full">Create Free Account</Button></Link>
            </article>
            <article className="card ai-plan-card ai-plan-pro">
              <p className="ai-plan-label">Pro</p>
              <h3>Full AI audit intelligence</h3>
              <p>Best for founders, teams, marketers, and agencies that need deeper recommendations.</p>
              <div className="ai-check-list">
                {proItems.map((item) => <div key={item} className="ai-check-row"><CheckCircle2 className="ai-check-icon" aria-hidden="true" /><span>{item}</span></div>)}
              </div>
              <UpgradeButton label="Start Pro Checkout" />
            </article>
          </div>
        </div>
      </section>

      <section className="container-shell ai-cta-section">
        <div className="card ai-cta-card">
          <p className="ai-kicker">Ready to find the friction?</p>
          <h2>Create an account to run your first AI UX Insight report.</h2>
          <p>Start free, then upgrade when you need the full AI-powered UX, WCAG, accessibility, and conversion report.</p>
          <Link href="/auth/signup"><Button>Create Account</Button></Link>
        </div>
      </section>

      <footer className="ai-footer">
        <div className="container-shell ai-footer-inner">
          <p>© 2026 AI UX Insight.</p>
          <div>
            <Link href="/pricing">Pricing</Link>
            <Link href="/auth/login">Sign In</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
