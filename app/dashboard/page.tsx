import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { createClient } from '@/lib/supabase/server';
import { normalizePlan } from '@/lib/plan';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login?redirect=/dashboard');

  const { data: profile } = await supabase.from('profiles').select('plan, audits_this_month').eq('id', user.id).single();

  return (
    <AppShell title="Dashboard" subtitle="Run audits and review UX, WCAG, and conversion findings">
      <DashboardView plan={normalizePlan(profile?.plan)} auditsThisMonth={profile?.audits_this_month ?? 0} />
    </AppShell>
  );
}
