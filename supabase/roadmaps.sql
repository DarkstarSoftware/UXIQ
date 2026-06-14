create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  audit_report_id uuid references public.audit_reports(id) on delete cascade,
  title text not null,
  site_name text not null,
  url text not null,
  summary text,
  items jsonb not null default '[]'::jsonb,
  quick_wins jsonb not null default '[]'::jsonb,
  next_phase jsonb not null default '[]'::jsonb,
  strategic_initiatives jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists roadmaps_user_created_idx on public.roadmaps(user_id, created_at desc);
create index if not exists roadmaps_audit_report_idx on public.roadmaps(audit_report_id);

alter table public.roadmaps enable row level security;

drop policy if exists "Users can view their own roadmaps" on public.roadmaps;
create policy "Users can view their own roadmaps" on public.roadmaps for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own roadmaps" on public.roadmaps;
create policy "Users can insert their own roadmaps" on public.roadmaps for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own roadmaps" on public.roadmaps;
create policy "Users can update their own roadmaps" on public.roadmaps for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own roadmaps" on public.roadmaps;
create policy "Users can delete their own roadmaps" on public.roadmaps for delete using (auth.uid() = user_id);
