import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function Toggle({ enabled }: { enabled?: boolean }) {
  return (
    <div
      className={`flex h-6 w-11 items-center rounded-full p-1 ${
        enabled ? 'bg-brand-500' : 'bg-ui-border'
      }`}
    >
      <div
        className={`h-4 w-4 rounded-full bg-white transition ${
          enabled ? 'translate-x-5' : ''
        }`}
      />
    </div>
  );
}

const auditPreferences = [
  {
    label: 'Include WCAG accessibility checks',
    description: 'Evaluate color contrast, form labels, alt text, keyboard access, and structure.',
    enabled: true,
  },
  {
    label: 'Reference Nielsen Norman heuristics',
    description: 'Include usability principles such as visibility, consistency, error prevention, and recognition.',
    enabled: true,
  },
  {
    label: 'Include conversion friction analysis',
    description: 'Identify weak calls-to-action, form friction, trust gaps, and confusing page hierarchy.',
    enabled: true,
  },
  {
    label: 'Include visual consistency review',
    description: 'Check spacing, hierarchy, button consistency, content density, and layout rhythm.',
    enabled: true,
  },
];

const accessibilityChecks = [
  'Color contrast',
  'Keyboard navigation',
  'Alt text coverage',
  'Form labels',
  'Heading structure',
  'Link clarity',
  'Focus states',
  'Error messaging',
];

export default function SettingsPage() {
  return (
    <AppShell
      title="Settings"
      subtitle="Manage your audit preferences, accessibility standards, and account settings"
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="section-title">Profile</h2>
            <p className="mt-2 text-sm text-ui-muted">
              Manage the account connected to your audits and saved reports.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input defaultValue="Todd Fleury" />
              <Input defaultValue="todd@example.com" />
            </div>

            <Button className="mt-5">Save Profile</Button>
          </div>

          <div className="card p-6">
            <h2 className="section-title">Audit Preferences</h2>
            <p className="mt-2 text-sm text-ui-muted">
              Choose what UXIQ should evaluate when generating reports.
            </p>

            <div className="mt-5 space-y-4">
              {auditPreferences.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start justify-between gap-4 rounded-xl border border-ui-border bg-ui-surface/60 px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="mt-1 text-sm text-ui-muted">{item.description}</p>
                  </div>
                  <Toggle enabled={item.enabled} />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="section-title">Accessibility & WCAG Compliance</h2>
            <p className="mt-2 text-sm text-ui-muted">
              Configure the accessibility standard used for audits and exported reports.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {['WCAG 2.1 AA', 'WCAG 2.2 AA', 'WCAG 2.2 AAA'].map((level, index) => (
                <div
                  key={level}
                  className={`rounded-xl border p-4 ${
                    index === 1
                      ? 'border-brand-500 bg-brand-500/10'
                      : 'border-ui-border bg-ui-surface/60'
                  }`}
                >
                  <p className="font-medium text-white">{level}</p>
                  <p className="mt-2 text-sm text-ui-muted">
                    {index === 1
                      ? 'Recommended default for modern accessibility audits.'
                      : 'Available for specialized review needs.'}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {accessibilityChecks.map((check) => (
                <div
                  key={check}
                  className="rounded-xl border border-ui-border bg-ui-surface/60 px-4 py-3 text-sm text-white"
                >
                  ✓ {check}
                </div>
              ))}
            </div>

            <Button className="mt-6">Save Accessibility Settings</Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="section-title">Plan & Usage</h2>

            <p className="mt-3 text-sm text-ui-muted">
              Free users receive a basic Nielsen Norman + WCAG-aware summary. Paid users receive full AI analysis.
            </p>

            <div className="mt-5 rounded-xl border border-ui-border bg-ui-surface/60 p-5">
              <p className="text-sm text-ui-muted">Current Plan</p>
              <p className="mt-2 text-3xl font-semibold text-white">Free</p>
              <p className="mt-2 text-sm text-ui-muted">
                Basic audit insights only
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-ui-border bg-ui-surface/60 p-5">
              <p className="text-sm text-ui-muted">Audits This Month</p>
              <p className="mt-2 text-5xl font-semibold text-white">3</p>
              <p className="text-sm text-ui-muted">basic audits used</p>
            </div>

            <Button className="mt-5 w-full">Upgrade to Full AI Reports</Button>
          </div>

          <div className="card p-6">
            <h2 className="section-title">Report Options</h2>

            <div className="mt-5 space-y-4">
              {[
                'Include executive summary',
                'Include prioritized fixes',
                'Include WCAG notes',
                'Include impact and effort ratings',
              ].map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-between rounded-xl border border-ui-border bg-ui-surface/60 px-4 py-3"
                >
                  <span className="text-sm text-white">{option}</span>
                  <Toggle enabled />
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-red-300">Danger Zone</h2>
            <p className="mt-3 text-sm text-ui-muted">
              Permanently delete your account and all saved audit reports.
            </p>

            <Button variant="danger" className="mt-5 w-full">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}