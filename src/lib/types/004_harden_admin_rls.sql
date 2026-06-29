-- Luna Labs - Supabase Migration: 004_harden_admin_rls.sql
--
-- Run this after 001_create_leads_table.sql and 002_create_projects_table.sql.
-- It makes database RLS enforce the same allowed_admins allowlist used by
-- hooks.server.ts, so authenticated non-admin users cannot read or mutate
-- admin data even if they talk to Supabase directly.

create or replace function public.is_allowed_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.allowed_admins
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_allowed_admin() from public;
grant execute on function public.is_allowed_admin() to authenticated;

alter table public.allowed_admins enable row level security;

drop policy if exists "admin_select_allowed_admins" on public.allowed_admins;
create policy "admin_select_allowed_admins"
  on public.allowed_admins
  for select
  to authenticated
  using (public.is_allowed_admin());

drop policy if exists "admin_select_leads" on public.leads;
create policy "admin_select_leads"
  on public.leads
  for select
  to authenticated
  using (public.is_allowed_admin());

drop policy if exists "admin_update_lead_status" on public.leads;
create policy "admin_update_lead_status"
  on public.leads
  for update
  to authenticated
  using (public.is_allowed_admin())
  with check (public.is_allowed_admin());

drop policy if exists "admin_select_projects" on public.projects;
create policy "admin_select_projects"
  on public.projects
  for select
  to authenticated
  using (public.is_allowed_admin());

drop policy if exists "admin_insert_projects" on public.projects;
create policy "admin_insert_projects"
  on public.projects
  for insert
  to authenticated
  with check (public.is_allowed_admin());

drop policy if exists "admin_update_projects" on public.projects;
create policy "admin_update_projects"
  on public.projects
  for update
  to authenticated
  using (public.is_allowed_admin())
  with check (public.is_allowed_admin());

drop policy if exists "admin_delete_projects" on public.projects;
create policy "admin_delete_projects"
  on public.projects
  for delete
  to authenticated
  using (public.is_allowed_admin());
