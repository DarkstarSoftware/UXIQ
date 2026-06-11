create or replace function public.increment_audits_this_month()
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set audits_this_month = coalesce(audits_this_month, 0) + 1,
      updated_at = now()
  where id = auth.uid();
end;
$$;
