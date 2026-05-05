/**
 * src/hooks.server.ts
 *
 * SvelteKit server hook — runs on EVERY server request before any load()
 * or endpoint handler. This is where global server-side logic lives.
 *
 * CURRENT ROLE (Phase 2):
 * Provides a stub locals.session = null so layout.server.ts compiles
 * cleanly. No auth logic yet.
 *
 * PHASE 3 PLAN (Ticket #16 — Implement Supabase Admin Auth):
 * Replace the stub with real session extraction using @supabase/ssr:
 *
 *   import { createServerClient } from '@supabase/ssr';
 *
 *   export const handle: Handle = async ({ event, resolve }) => {
 *     const supabase = createServerClient(
 *       SUPABASE_URL, SUPABASE_ANON_KEY,
 *       { cookies: { get: event.cookies.get, ... } }
 *     );
 *     const { data: { session } } = await supabase.auth.getSession();
 *     event.locals.session = session;
 *     event.locals.supabase = supabase;
 *     return resolve(event);
 *   };
 *
 * The /admin layout.server.ts then reads event.locals.session and
 * redirects to /admin/login if null.
 */

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Phase 2 stub — session will be populated in Phase 3
  event.locals.session = null;

  return resolve(event);
};