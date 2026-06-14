create table if not exists public.competitor_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  primary_url text not null,
  competitor_urls jsonb not null default '[]'::jsonb,
  results jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists competitor_comparisons_user_created_idx
on public.competitor_comparisons(user_id, created_at desc);

alter table public.competitor_comparisons enable row level security;

drop policy if exists "Users can view their own competitor comparisons" on public.competitor_comparisons;
create policy "Users can view their own competitor comparisons"
on public.competitor_comparisons for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own competitor comparisons" on public.competitor_comparisons;
create policy "Users can insert their own competitor comparisons"
on public.competitor_comparisons for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own competitor comparisons" on public.competitor_comparisons;
create policy "Users can delete their own competitor comparisons"
on public.competitor_comparisons for delete using (auth.uid() = user_id);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists role text;
