import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

export default async function CompetitorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/competitors');

  const { data } = await supabase
    .from('competitor_comparisons')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <AppShell title="Competitors" subtitle="Compare your UX performance against competing websites" actions={<Link href="/competitors/new"><Button>Add Comparison</Button></Link>}>
      {!data?.length ? (
        <section className="card app-section">
          <h2 className="section-title">No comparisons yet</h2>
          <p className="mt-3 app-muted">Create a competitor comparison to see how your UX, WCAG, and conversion scores stack up.</p>
          <div className="mt-6"><Link href="/competitors/new"><Button>Add Comparison</Button></Link></div>
        </section>
      ) : (
        <section className="card app-section">
          <div className="report-list">
            {data.map((item) => (
              <div key={item.id} className="report-row">
                <div><p className="report-title">{item.name}</p><p className="report-url">{item.primary_url}</p><p className="mt-2 app-muted">{item.results?.summary}</p></div>
                <div><span className="score-chip">{item.results?.primary?.score ?? '-'}</span></div>
                <div><p className="app-muted">{new Date(item.created_at).toLocaleDateString()}</p></div>
                <Link href={`/competitors/${item.id}`}><Button variant="secondary">View</Button></Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
