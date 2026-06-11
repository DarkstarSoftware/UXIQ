create table if not exists public.competitor_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  primary_url text not null,
  competitor_urls text[] not null default '{}',
  score integer not null default 0,
  summary text,
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.competitor_reports enable row level security;

drop policy if exists "Users can view own competitor reports" on public.competitor_reports;
create policy "Users can view own competitor reports"
on public.competitor_reports for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own competitor reports" on public.competitor_reports;
create policy "Users can insert own competitor reports"
on public.competitor_reports for insert
with check (auth.uid() = user_id);

create index if not exists competitor_reports_user_created_idx
on public.competitor_reports(user_id, created_at desc);
