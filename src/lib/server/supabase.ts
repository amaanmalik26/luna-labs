/**
 * src/lib/server/supabase.ts
 *
 * SERVER-ONLY Supabase clients.
 * Lives in $lib/server/ — SvelteKit blocks any import of this
 * file from browser/client code at build time. Safe by design.
 *
 * TWO EXPORTS:
 *
 * 1. createAnonClient()
 *    Uses SUPABASE_ANON_KEY. Respects Row Level Security.
 *    The anon key can only INSERT into leads (per our SQL policy).
 *    Use this in public-facing API routes like /api/leads.
 *
 * 2. createAdminClient()
 *    Uses SUPABASE_SERVICE_ROLE_KEY. Bypasses RLS entirely.
 *    Use this ONLY in /admin/** routes after verifying the session.
 *    NEVER call this from a route anonymous users can reach.
 *
 * HOW TO GET YOUR KEYS:
 *   Supabase Dashboard → Settings → API → Project API Keys
 *   anon/public  → SUPABASE_ANON_KEY
 *   service_role → SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} from '$env/static/private';
import type { Database } from '$lib/types/database';

export function createAnonClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

export function createAdminClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}