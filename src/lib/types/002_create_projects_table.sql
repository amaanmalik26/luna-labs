-- Luna Labs - Supabase Migration: 002_create_projects_table.sql
--
-- Run this after 001_create_leads_table.sql.
-- Supabase Dashboard -> SQL Editor -> paste and run this entire file.

create table if not exists public.projects (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null check (char_length(title) between 2 and 120),
  category     text        not null check (char_length(category) between 2 and 120),
  description  text        not null check (char_length(description) between 20 and 1200),
  stack        text[]      not null default '{}',
  status       text        not null default 'concept'
                         check (status in ('live', 'concept', 'in-progress')),
  website_url  text,
  logo_url     text,
  year         text        not null default extract(year from now())::text,
  featured     boolean     not null default false,
  is_published boolean     not null default true,
  sort_order   integer     not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists projects_public_sort_idx
  on public.projects (is_published, featured desc, sort_order asc, created_at asc);

alter table public.projects enable row level security;

drop policy if exists "anon_select_projects" on public.projects;
create policy "anon_select_projects"
  on public.projects
  for select
  to anon
  using (is_published = true);

drop policy if exists "admin_select_projects" on public.projects;
create policy "admin_select_projects"
  on public.projects
  for select
  to authenticated
  using (true);

drop policy if exists "admin_insert_projects" on public.projects;
create policy "admin_insert_projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "admin_update_projects" on public.projects;
create policy "admin_update_projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin_delete_projects" on public.projects;
create policy "admin_delete_projects"
  on public.projects
  for delete
  to authenticated
  using (true);

insert into public.projects (
  id,
  title,
  category,
  description,
  stack,
  status,
  website_url,
  logo_url,
  year,
  featured,
  is_published,
  sort_order
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Luna Labs',
    'Brand & Web System',
    'The very site you are on. A premium agency marketing platform built with SvelteKit and Supabase - featuring a lead capture engine with Discord integration, a real-time admin dashboard, and a design system built from scratch.',
    array['SvelteKit', 'Supabase', 'Tailwind 4', 'Vercel', 'TypeScript', 'Zod'],
    'in-progress',
    'https://www.lunalabs.site',
    '/favicon.ico',
    '2026',
    true,
    true,
    0
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Orion Dashboard',
    'SaaS / Admin UI',
    'A concept B2B analytics dashboard with real-time data tables, chart components, and a multi-tenant role system built on Supabase RLS.',
    array['SvelteKit', 'Supabase Realtime', 'Chart.js', 'PostgreSQL'],
    'concept',
    null,
    null,
    '2026',
    false,
    true,
    10
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Meridian Commerce',
    'E-Commerce Platform',
    'A high-conversion e-commerce front-end concept - product grid, cart state, and a one-page checkout flow with full mobile optimisation.',
    array['SvelteKit', 'Stripe', 'Tailwind', 'Sanity CMS'],
    'concept',
    null,
    null,
    '2026',
    false,
    true,
    20
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Pulse CRM',
    'Internal Tool',
    'A lightweight lead and client management tool for small agencies - full CRUD, status pipeline, and email-thread association built in a single sprint.',
    array['SvelteKit', 'Supabase', 'Resend', 'Zod'],
    'concept',
    null,
    null,
    '2026',
    false,
    true,
    30
  )
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  stack = excluded.stack,
  status = excluded.status,
  website_url = excluded.website_url,
  logo_url = excluded.logo_url,
  year = excluded.year,
  featured = excluded.featured,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();
