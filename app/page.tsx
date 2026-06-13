import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  Lock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import { UpgradeButton } from '@/components/billing/upgrade-button';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

const reviewAreas = [
  {
    icon: Eye,
    title: 'UX clarity review',
    body: 'Find confusing hierarchy, weak information scent, missing affordances, and unclear user paths.',
  },
  {
    icon: ShieldCheck,
    title: 'WCAG-aware accessibility',
    body: 'Review contrast, labels, headings, focus states, keyboard access, and form usability.',
  },
  {
    icon: TrendingUp,
    title: 'Conversion friction',
    body: 'Identify the exact issues that reduce signups, demos, checkouts, and lead conversion.',
  },
];

const proItems = [
  'Full AI-powered audit report',
  'WCAG 2.2 AA-oriented review',
  'Conversion optimization recommendations',
  'Impact and effort prioritization',
  'Saved report history',
  'Competitor and roadmap workflows',
];

export default function HomePage() {
  return (
    <main className="premium-page">
      <header className="premium-nav">
        <div className="premium-shell premium-nav-inner">
          <Logo href="/" />
          <nav className="premium-nav-links" aria-label="Primary navigation">
            <Link href="#how-it-works">How it works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/auth/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Create Account</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="premium-shell premium-hero">
        <div className="premium-hero-copy">
          <p className="premium-eyebrow">AI-powered UX, accessibility, and conversion intelligence</p>

          <h1>
            Find the UX issues costing your site conversions.
          </h1>

          <p className="premium-subtitle">
            AIUX Insight reviews your website like a senior UX strategist, accessibility specialist,
            and conversion analyst — then turns the findings into prioritized fixes.
          </p>

          <div className="premium-actions">
            <Link href="/auth/signup">
              <Button>
                Start Free Audit <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary">View Pricing</Button>
            </Link>
          </div>

          <div className="premium-proof">
            <span><CheckCircle2 aria-hidden="true" /> WCAG-aware checks</span>
            <span><CheckCircle2 aria-hidden="true" /> Conversion recommendations</span>
            <span><CheckCircle2 aria-hidden="true" /> Built for teams and agencies</span>
          </div>
        </div>

        <aside className="audit-preview-card" aria-label="Sample AIUX Insight audit preview">
          <div className="audit-preview-toolbar">
            <div>
              <p className="mini-label">Live audit preview</p>
              <strong>nikestore.com</strong>
            </div>
            <span className="status-pill">AI Report</span>
          </div>

          <div className="audit-score-panel">
            <div className="score-dial">
              <div className="score-dial-inner">72</div>
            </div>

            <div>
              <p className="score-title">UX Score</p>
              <p className="score-summary">Good, but losing conversions.</p>
              <p className="score-copy">
                High-impact fixes found across CTA visibility, form accessibility, and page hierarchy.
              </p>
            </div>
          </div>

          <div className="metric-grid">
            {[
              ['Usability', '68'],
              ['Accessibility', '54'],
              ['Conversion', '61'],
              ['Visual Design', '80'],
            ].map(([label, score]) => (
              <div key={label} className="metric-card">
                <span>{label}</span>
                <strong>{score}</strong>
              </div>
            ))}
          </div>

          <div className="issue-stack">
            {[
              ['HIGH', 'CTA button lacks contrast'],
              ['HIGH', 'No clear call-to-action above the fold'],
              ['MED', 'Form is too long'],
            ].map(([severity, issue]) => (
              <div key={issue} className="premium-issue-row">
                <span className={severity === 'HIGH' ? 'severity high' : 'severity med'}>{severity}</span>
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section id="how-it-works" className="premium-shell premium-section">
        <div className="premium-section-heading">
          <p className="premium-eyebrow">What AIUX reviews</p>
          <h2>Built around the issues that affect trust, usability, accessibility, and revenue.</h2>
        </div>

        <div className="premium-feature-grid">
          {reviewAreas.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="premium-feature-card">
                <Icon className="feature-icon" aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="premium-plan-band">
        <div className="premium-shell">
          <div className="premium-section-heading centered">
            <p className="premium-eyebrow">Free vs Pro</p>
            <h2>Start with a quick scan. Upgrade for full AI audit intelligence.</h2>
            <p>
              Free users receive basic UX and WCAG-aware findings. Pro users unlock complete reports,
              exports, saved history, competitors, and roadmaps.
            </p>
          </div>

          <div className="premium-plan-grid">
            <article className="premium-plan-card">
              <p className="mini-label">Free</p>
              <h3>Basic audit summary</h3>
              <p>Great for fast validation and identifying obvious UX or accessibility concerns.</p>
              <ul>
                <li><CheckCircle2 aria-hidden="true" /> Overall UX score</li>
                <li><CheckCircle2 aria-hidden="true" /> Basic heuristic references</li>
                <li><CheckCircle2 aria-hidden="true" /> Top findings</li>
              </ul>
              <Link href="/auth/signup">
                <Button variant="secondary" className="w-full">Create Free Account</Button>
              </Link>
            </article>

            <article className="premium-plan-card featured">
              <div className="plan-card-topline">
                <p className="mini-label">Pro</p>
                <span className="status-pill">Best value</span>
              </div>
              <h3>Full AI audit intelligence</h3>
              <p>Best for founders, product teams, marketers, and agencies that need prioritized fixes.</p>
              <ul>
                {proItems.map((item) => (
                  <li key={item}><CheckCircle2 aria-hidden="true" /> {item}</li>
                ))}
              </ul>
              <UpgradeButton label="Start Pro Checkout" />
            </article>
          </div>
        </div>
      </section>

      <section className="premium-shell premium-cta-section">
        <div className="premium-cta-card">
          <BarChart3 className="cta-icon" aria-hidden="true" />
          <p className="premium-eyebrow">Ready to find the friction?</p>
          <h2>Run your first AIUX Insight audit today.</h2>
          <p>
            See where users struggle, where accessibility breaks down, and which fixes can improve conversion fastest.
          </p>
          <Link href="/auth/signup">
            <Button>Create Account</Button>
          </Link>
        </div>
      </section>

      <footer className="premium-footer">
        <div className="premium-shell premium-footer-inner">
          <p>© 2026 AIUX Insight.</p>
          <div>
            <Link href="/pricing">Pricing</Link>
            <Link href="/auth/login">Sign In</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
