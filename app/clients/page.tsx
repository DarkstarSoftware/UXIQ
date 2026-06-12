import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { ClientForm } from '@/components/agency/client-form';
import { normalizePlan } from '@/lib/plan';
import { createClient } from '@/lib/supabase/server';

export default async function ClientsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/clients');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = normalizePlan(profile?.plan);

  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, website, contact_email, notes, created_at')
    .order('created_at', { ascending: false });

  return (
    <AppShell
      title="Clients"
      subtitle="Manage client profiles for agency-ready reporting"
    >
      {plan !== 'pro' ? (
        <div className="card p-8">
          <h2 className="section-title">Agency Mode is a Pro feature</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ui-muted">
            Upgrade to Pro to manage clients, organize reports, and prepare white-label deliverables.
          </p>
          <form action="/api/stripe/checkout" method="POST">
            <Button className="mt-6">Upgrade to Pro</Button>
          </form>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <ClientForm />

          <div className="card p-6">
            <h2 className="section-title">Client List</h2>

            <div className="mt-5 space-y-3">
              {(clients ?? []).length === 0 ? (
                <p className="text-sm text-ui-muted">No clients yet. Add your first client.</p>
              ) : (
                clients?.map((client) => (
                  <div
                    key={client.id}
                    className="rounded-xl border border-ui-border bg-ui-surface/60 p-4"
                  >
                    <p className="font-semibold text-white">{client.name}</p>
                    {client.website ? (
                      <p className="mt-1 text-sm text-ui-muted">{client.website}</p>
                    ) : null}
                    {client.contact_email ? (
                      <p className="mt-1 text-sm text-ui-muted">{client.contact_email}</p>
                    ) : null}
                    {client.notes ? (
                      <p className="mt-3 text-sm leading-6 text-ui-muted">{client.notes}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
