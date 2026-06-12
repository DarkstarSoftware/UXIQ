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

const auditPillars = [
  {
    icon: CheckCircle2,
    title: 'Nielsen Norman-inspired usability review',
    body: 'Evaluate clarity, consistency, recognition over recall, error prevention, feedback, and user control.',
  },
  {
    icon: ShieldCheck,
    title: 'WCAG-aware accessibility checks',
    body: 'Surface common barriers around contrast, heading structure, labels, alt text, focus states, and forms.',
  },
  {
    icon: TrendingUp,
    title: 'Conversion friction analysis',
    body: 'Identify weak CTAs, confusing hierarchy, form friction, trust gaps, and unclear next steps.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered Pro recommendations',
    body: 'Paid users unlock deeper AI-generated findings, prioritized fixes, and business-focused recommendations.',
  },
];

const freeItems = [
  'Account required',
  'Overall UX score',
  'Basic Nielsen Norman references',
  'Basic WCAG-aware observations',
  'Top findings',
];

const proItems = [
  'Full AI-powered audit',
  'Detailed WCAG 2.2 AA-oriented review',
  'Conversion optimization recommendations',
  'Impact and effort ratings',
  'Saved audit history',
  'Competitor insights',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ui-bg text-white">
      <header className="border-b border-ui-border/70">
        <div className="container-shell flex h-20 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 text-sm text-ui-muted md:flex">
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
            <a href="#plans" className="hover:text-white">
              Free vs Pro
            </a>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Create Account</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container-shell py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-sky-300">
              AI-Powered UX, Accessibility & Conversion Intelligence
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              See your website through the eyes of UX experts and AI.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-ui-muted">
              Darkstar Audit AI helps teams uncover usability issues, WCAG compliance gaps,
              accessibility barriers, and conversion friction before those problems cost
              them customers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/signup">
                <Button className="h-12 px-6">
                  Start Free Audit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/pricing">
                <Button variant="secondary" className="h-12 px-6">
                  Compare Plans
                </Button>
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-ui-muted">
              <Lock className="h-4 w-4 text-sky-300" />
              Sign in required before running an audit.
            </div>
          </div>

          <div className="card p-6">
            <div className="rounded-2xl border border-ui-border bg-ui-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-ui-muted">Sample audit preview</p>
                <span className="rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs text-brand-200">
                  Free Preview
                </span>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-7xl font-semibold text-white">72</p>
                  <p className="mt-2 text-sm text-ui-muted">
                    Good, but losing conversions
                  </p>
                </div>

                <div className="rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-sm text-warning">
                  WCAG notes
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  'CTA hierarchy needs improvement',
                  'Form labels require accessibility review',
                  'Hero section lacks one dominant next step',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-ui-border bg-ui-bg/60 p-3 text-sm text-ui-muted"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-ui-border bg-ui-bg/80 p-4">
                <p className="text-sm font-medium text-white">Upgrade unlocks:</p>
                <p className="mt-1 text-sm text-ui-muted">
                  Full AI recommendations, prioritized fixes, saved reports, and competitor insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-shell pb-20">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.22em] text-brand-300">
            What Darkstar Audit AI reviews
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            Built around the issues that impact trust, accessibility, and conversion.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {auditPillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div key={pillar.title} className="card p-6">
                <Icon className="h-6 w-6 text-sky-300" />
                <h3 className="mt-5 text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ui-muted">
                  {pillar.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="plans" className="border-y border-ui-border/70 py-16">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.22em] text-brand-300">
              Free vs Pro
            </p>
            <h2 className="mt-3 text-4xl font-semibold">
              Start with basic guidance. Upgrade for the full AI audit engine.
            </h2>
            <p className="mt-4 text-ui-muted">
              Every user must create an account before running an audit. Free users receive
              basic heuristic and WCAG-aware findings. Pro users receive full AI-powered analysis.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="card p-8">
              <p className="text-sm uppercase tracking-[0.2em] text-ui-muted">Free</p>
              <h3 className="mt-3 text-3xl font-semibold">Basic audit summary</h3>
              <p className="mt-3 text-ui-muted">
                Great for quick validation and understanding obvious UX or accessibility concerns.
              </p>

              <div className="mt-6 space-y-3">
                {freeItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-ui-muted">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {item}
                  </div>
                ))}
              </div>

              <Link href="/auth/signup">
                <Button variant="secondary" className="mt-8 w-full">
                  Create Free Account
                </Button>
              </Link>
            </div>

            <div className="card border-brand-500/50 p-8 ring-1 ring-brand-500/30">
              <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Pro</p>
              <h3 className="mt-3 text-3xl font-semibold">Full AI audit intelligence</h3>
              <p className="mt-3 text-ui-muted">
                Best for founders, teams, marketers, and agencies that need deeper recommendations.
              </p>

              <div className="mt-6 space-y-3">
                {proItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-ui-muted">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {item}
                  </div>
                ))}
              </div>

              <Link href="/pricing">
                <Button className="mt-8 w-full">
                  View Pro Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="card p-8 text-center md:p-12">
          <p className="text-sm uppercase tracking-[0.22em] text-sky-300">
            Ready to find the friction?
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold">
            Create an account to run your first Darkstar Audit AI report.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ui-muted">
            Start free, then upgrade when you need the full AI-powered UX, WCAG, and conversion report.
          </p>
          <Link href="/auth/signup">
            <Button className="mt-8 h-12 px-8">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-ui-border/70 py-8">
        <div className="container-shell flex flex-col gap-4 text-sm text-ui-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 Darkstar Software. Darkstar Audit AI.</p>
          <div className="flex gap-5">
            <Link href="/pricing">Pricing</Link>
            <Link href="/auth/login">Sign In</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
