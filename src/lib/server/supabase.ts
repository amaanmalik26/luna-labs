/**
 * src/lib/server/supabase.ts
 *
 * SERVER-ONLY Supabase client factory.
 * Anything in $lib/server/ cannot be imported by client code.
 *
 * ── NEW SUPABASE KEY SYSTEM ──────────────────────────────────────────
 * Supabase now issues "publishable keys" (sb_publishable_...) instead of
 * the legacy "anon key" (eyJ...). Your .env needs:
 *
 *   SUPABASE_URL              = https://xxx.supabase.co
 *   SUPABASE_PUBLISHABLE_KEY  = sb_publishable_...
 *   SUPABASE_SECRET_KEY       = sb_secret_...
 *
 * Dashboard → Settings → API → Project API Keys
 *
 * ── WHY USE SECRET KEY FOR /api/leads ────────────────────────────────
 * The form API route is server-side trusted code. It has already:
 *   - Validated input with Zod
 *   - Rate-limited by IP
 * Using the secret key bypasses RLS cleanly. The publishable key + RLS
 * is unreliable on server routes with the new key format because the
 * new publishable key JWT claims differ from the legacy anon JWT.
 * RLS still protects direct browser → Supabase calls.
 */

import { createClient } from '@supabase/supabase-js';
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY,
} from '$env/static/private';
import type { Database } from '$lib/types/database';

/**
 * Publishable client — respects RLS.
 * Use for reads that mirror logged-out user access.
 */
export function createPublicClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Service client — bypasses RLS.
 * Use for server-side inserts and admin operations.
 * NEVER call from client-side code.
 */
export function createServiceClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false },
  });
}

// Legacy aliases so old import names keep working
export const createAnonClient  = createPublicClient;
export const createAdminClient = createServiceClient;