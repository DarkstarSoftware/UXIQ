create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id uuid references public.audit_reports(id) on delete cascade,
  title text not null,
  summary text,
  roadmap jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.roadmaps enable row level security;

drop policy if exists "Users can view own roadmaps" on public.roadmaps;
create policy "Users can view own roadmaps"
on public.roadmaps for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own roadmaps" on public.roadmaps;
create policy "Users can insert own roadmaps"
on public.roadmaps for insert
with check (auth.uid() = user_id);

create index if not exists roadmaps_user_created_idx
on public.roadmaps(user_id, created_at desc);

create index if not exists roadmaps_report_idx
on public.roadmaps(report_id);
