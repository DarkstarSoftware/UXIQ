insert into public.profiles (id, email, plan, subscription_status, subscription_current_period_end)
select id, email, 'pro', 'lifetime', null
from auth.users
where lower(email) = lower('toddfleury1979@gmail.com')
on conflict (id) do update
set email = excluded.email,
    plan = 'pro',
    subscription_status = 'lifetime',
    subscription_current_period_end = null;
