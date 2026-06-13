alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists plan text not null default 'free';
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists subscription_status text default 'inactive';
alter table public.profiles add column if not exists subscription_current_period_end timestamptz;
alter table public.profiles add column if not exists billing_email text;
alter table public.profiles add column if not exists audits_this_month integer not null default 0;

create index if not exists profiles_stripe_customer_id_idx on public.profiles(stripe_customer_id);
create index if not exists profiles_stripe_subscription_id_idx on public.profiles(stripe_subscription_id);

insert into public.profiles (
  id,
  email,
  plan,
  subscription_status,
  subscription_current_period_end
)
select
  id,
  email,
  'pro',
  'lifetime',
  null
from auth.users
where lower(email) = lower('toddfleury1979@gmail.com')
on conflict (id) do update
set
  email = excluded.email,
  plan = 'pro',
  subscription_status = 'lifetime',
  subscription_current_period_end = null;
