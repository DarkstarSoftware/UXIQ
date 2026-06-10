import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { competitors, fixes } from '@/lib/mock-data';
import { getUserAndPlan } from '@/lib/supabase-server';

const comparisonRows: { label: string; values: number[] }[] = [
  { label: 'Usability', values: [68, 62, 59] },
  { label: 'Accessibility', values: [54, 71, 63] },
  { label: 'Conversion', values: [61, 58, 55] },
  { label: 'Visual Design', values: [80, 76, 72] },
];

export default async function CompetitorsPage() {
  const { plan } = await getUserAndPlan();
  const locked = plan === 'free';

  return (
    <AppShell title="Competitors" subtitle="Compare UX performance across market alternatives">
      <div className="space-y-6">
        {locked && <div className="card border-brand-500/40 bg-brand-500/10 p-5 text-sm text-ui-muted">Competitor comparison is a paid feature. Free users can preview the layout, but full competitor AI insights require a monthly plan.</div>}
        <div className="card p-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <Input defaultValue="nike.com" disabled={locked} />
            <Input defaultValue="adidas.com" disabled={locked} />
            <Input defaultValue="underarmour.com" disabled={locked} />
            <Button disabled={locked}>Compare</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {competitors.map((site) => <div key={site.site} className="card p-6"><p className="text-sm text-ui-muted">{site.site}</p><p className="mt-3 text-5xl font-semibold text-white">{site.score}</p><p className="mt-2 text-sm text-ui-muted">Overall UX score</p></div>)}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="card p-6">
            <h2 className="section-title">Category comparison</h2>
            <div className="mt-6 space-y-5">
              {comparisonRows.map(({ label, values }) => <div key={label}><div className="mb-2 flex items-center justify-between text-sm text-ui-muted"><span>{label}</span><span>{values.join(' / ')}</span></div><div className="space-y-2">{values.map((value, index) => <div key={`${label}-${index}`} className="h-3 rounded-full bg-ui-surface"><div className="h-3 rounded-full bg-gradient-to-r from-sky-400 to-brand-500" style={{ width: `${value}%` }} /></div>)}</div></div>)}
            </div>
          </div>
          <div className="space-y-4"><div className="card p-6"><h2 className="section-title">Top opportunities</h2><div className="mt-5 space-y-4">{fixes.map((fix) => <div key={fix.title} className="rounded-xl border border-ui-border bg-ui-surface/60 p-4"><p className="font-medium text-white">{fix.title}</p><p className="mt-2 text-sm text-ui-muted">{fix.description}</p></div>)}</div></div><div className="card p-6"><p className="text-lg font-semibold text-white">Unlock full competitor insights</p><p className="mt-3 text-sm text-ui-muted">Premium plans include more domains, exports, and page-by-page opportunity breakdowns.</p><Button className="mt-5 w-full">Upgrade to Pro</Button></div></div>
        </div>
      </div>
    </AppShell>
  );
}
