import { AppShell } from '@/components/layout/app-shell';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { getUserAndPlan } from '@/lib/supabase-server';

export default async function DashboardPage() {
  const { plan } = await getUserAndPlan();
  return (
    <AppShell title="Dashboard" subtitle="Analyze websites after signing in. Free users get basic audits; paid users unlock full AI analysis.">
      <DashboardView initialPlan={plan} />
    </AppShell>
  );
}
