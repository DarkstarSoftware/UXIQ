create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  website text,
  contact_email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

drop policy if exists "Users can view own clients" on public.clients;
create policy "Users can view own clients"
on public.clients for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own clients" on public.clients;
create policy "Users can insert own clients"
on public.clients for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own clients" on public.clients;
create policy "Users can update own clients"
on public.clients for update
using (auth.uid() = user_id);

alter table public.audit_reports
add column if not exists client_id uuid references public.clients(id) on delete set null;

create index if not exists clients_user_created_idx
on public.clients(user_id, created_at desc);

create index if not exists audit_reports_client_idx
on public.audit_reports(client_id);
