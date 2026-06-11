create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'inactive',
  audits_this_month integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  normalized_url text not null,
  score integer not null default 0,
  summary text,
  source text not null default 'basic',
  plan text not null default 'free',
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.audit_reports enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "Users can view own reports" on public.audit_reports;
create policy "Users can view own reports"
on public.audit_reports for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own reports" on public.audit_reports;
create policy "Users can insert own reports"
on public.audit_reports for insert
with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'free'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create index if not exists audit_reports_user_created_idx
on public.audit_reports(user_id, created_at desc);
