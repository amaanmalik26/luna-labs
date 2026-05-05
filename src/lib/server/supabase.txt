/**
 * src/lib/server/supabase.ts
 *
 * SERVER-ONLY Supabase client factory.
 *
 * WHY THIS FILE EXISTS IN /server/:
 * SvelteKit enforces that anything in $lib/server cannot be imported
 * by client-side code. If you accidentally import this in a .svelte
 * component, the build fails with a clear error. This prevents the
 * SERVICE_ROLE_KEY from ever leaking to the browser bundle.
 *
 * TWO CLIENTS — WHY:
 *
 * 1. createAnonClient() — uses SUPABASE_ANON_KEY
 *    Used by the public /api/leads endpoint. The anon key respects
 *    Row Level Security — it can only INSERT into leads (per our policy),
 *    never SELECT. Safe to use in API routes that the public triggers.
 *
 * 2. createAdminClient() — uses SUPABASE_SERVICE_ROLE_KEY
 *    Bypasses RLS entirely. Only used in admin-authenticated server routes
 *    where we've already verified the user is the admin via Supabase Auth.
 *    NEVER expose this key to the browser.
 *
 * SETUP:
 *   Copy .env.example to .env and fill in your Supabase project values:
 *   SUPABASE_URL             = https://YOUR_PROJECT.supabase.co
 *   SUPABASE_ANON_KEY        = eyJ...
 *   SUPABASE_SERVICE_ROLE_KEY = eyJ...
 */

import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} from '$env/static/private';
import type { Database } from '$lib/types/database';

/**
 * Public-facing anon client.
 * Respects RLS — safe for use in routes that handle untrusted input.
 * Used by: /api/leads POST
 */
export function createAnonClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Service role client — bypasses RLS.
 * Used by: /admin/** routes (after auth verification).
 * NEVER call this in a route that anonymous users can reach.
 */
export function createAdminClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}