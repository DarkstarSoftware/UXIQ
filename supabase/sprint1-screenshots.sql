alter table public.audit_reports
add column if not exists screenshot_url text;
