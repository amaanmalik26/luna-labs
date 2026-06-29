-- Luna Labs - Supabase Migration: 003_projects_links_and_logos.sql
--
-- Run this if you already applied 002_create_projects_table.sql before
-- website links and logo URLs were added.

alter table public.projects
  add column if not exists website_url text,
  add column if not exists logo_url text;

update public.projects
set
  website_url = coalesce(website_url, 'https://www.lunalabs.site'),
  logo_url = coalesce(logo_url, '/favicon.ico'),
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111111';
