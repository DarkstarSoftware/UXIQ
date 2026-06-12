alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists subscription_status text default 'inactive';
alter table public.profiles add column if not exists subscription_current_period_end timestamptz;
alter table public.profiles add column if not exists billing_email text;

create index if not exists profiles_stripe_customer_id_idx on public.profiles(stripe_customer_id);
create index if not exists profiles_stripe_subscription_id_idx on public.profiles(stripe_subscription_id);
