alter table public.competitor_comparisons
add column if not exists summary jsonb;
