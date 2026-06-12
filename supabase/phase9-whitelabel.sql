create table if not exists public.agency_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  agency_name text,
  logo_url text,
  primary_color text default '#4F46E5',
  accent_color text default '#06B6D4',
  custom_domain text,
  created_at timestamptz default now()
);

alter table public.agency_settings enable row level security;

create policy "Users manage own agency settings"
on public.agency_settings
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
