import { Sidebar } from '@/components/layout/sidebar';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';

export async function AppShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-ui-bg">
      <Sidebar />
      <main className="min-w-0 flex-1 p-4 lg:p-8">
        <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-ui-border bg-ui-surface/60 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
            <p className="mt-2 text-sm text-ui-muted">{subtitle}</p>
          </div>
          <form action="/auth/signout" method="post" className="flex items-center gap-3">
            <span className="hidden text-sm text-ui-muted md:inline">{user?.email}</span>
            <Button type="submit" variant="secondary">Sign out</Button>
          </form>
        </header>
        {children}
      </main>
    </div>
  );
}
