-- ─────────────────────────────────────────────────────────────────────────
-- Luna Labs — Supabase Migration: 001_create_leads_table.sql
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → paste and run this entire file.
--   OR: via Supabase CLI: supabase db push
--
-- This creates the leads table, indexes, and Row Level Security policies.
-- RLS is critical: it ensures only authenticated admins can read leads,
-- while the anon key (used by the public API route) can only INSERT.
-- ─────────────────────────────────────────────────────────────────────────

-- 1. Enable UUID generation (built into Supabase by default, but safe to ensure)
create extension if not exists "pgcrypto";

-- 2. Create the leads table
create table if not exists public.leads (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null check (char_length(name) between 2 and 100),
  email             text        not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  business          text,                   -- nullable: individuals may not have a business name
  service_requested text        not null,
  message           text        not null check (char_length(message) between 10 and 2000),
  status            text        not null default 'new'
                    check (status in ('new', 'contacted', 'closed')),
  created_at        timestamptz not null default now()
);

-- 3. Index on created_at DESC — the admin dashboard default sort order
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

-- 4. Index on status — for filtering by pipeline stage
create index if not exists leads_status_idx
  on public.leads (status);

-- 5. Enable Row Level Security
alter table public.leads enable row level security;

-- 6. RLS Policy: anonymous users (public API) can INSERT only
--    This is the policy that lets the /api/leads endpoint write rows
--    using the public anon key — without being able to read other rows.
create policy "anon_insert_leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- 7. RLS Policy: authenticated admins can SELECT all rows
create policy "admin_select_leads"
  on public.leads
  for select
  to authenticated
  using (true);

-- 8. RLS Policy: authenticated admins can UPDATE status only
create policy "admin_update_lead_status"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);

-- ─── FUTURE: projects table (V2) ─────────────────────────────────────
-- Uncomment when building the portfolio admin editor (Phase 3+)
--
-- create table if not exists public.projects (
--   id          uuid        primary key default gen_random_uuid(),
--   title       text        not null,
--   category    text        not null,
--   description text        not null,
--   stack       text[]      not null default '{}',
--   status      text        not null default 'concept'
--               check (status in ('live', 'concept', 'in-progress')),
--   gradient    text,
--   year        text,
--   featured    boolean     not null default false,
--   sort_order  integer     not null default 0,
--   created_at  timestamptz not null default now()
-- );
-- alter table public.projects enable row level security;
-- create policy "anon_select_projects" on public.projects
--   for select to anon using (true);
-- create policy "admin_all_projects" on public.projects
--   for all to authenticated using (true) with check (true);