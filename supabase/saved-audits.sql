create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  site_name text not null,
  slug text not null,
  plan text not null default 'free',
  audit_mode text not null default 'free',
  score integer not null default 0,
  summary text,
  metrics jsonb not null default '{}'::jsonb,
  issues jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  contrast_checks jsonb not null default '[]'::jsonb,
  wcag_checks jsonb not null default '[]'::jsonb,
  heuristic_checks jsonb not null default '[]'::jsonb,
  raw_audit jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_reports_user_created_idx
on public.audit_reports(user_id, created_at desc);

create index if not exists audit_reports_user_slug_idx
on public.audit_reports(user_id, slug);

alter table public.audit_reports enable row level security;

drop policy if exists "Users can view their own audit reports" on public.audit_reports;
create policy "Users can view their own audit reports"
on public.audit_reports for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own audit reports" on public.audit_reports;
create policy "Users can insert their own audit reports"
on public.audit_reports for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own audit reports" on public.audit_reports;
create policy "Users can update their own audit reports"
on public.audit_reports for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own audit reports" on public.audit_reports;
create policy "Users can delete their own audit reports"
on public.audit_reports for delete
using (auth.uid() = user_id);
