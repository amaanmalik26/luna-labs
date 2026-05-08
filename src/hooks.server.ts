/**
 * src/hooks.server.ts
 *
 * Runs before EVERY request. Responsible for:
 *   1. Creating a per-request Supabase client that reads/writes cookies
 *   2. Extracting the session from the cookie
 *   3. Checking if the session user is in the allowed_admins table
 *   4. Populating event.locals so every load() and endpoint can use them
 *
 * WHY @supabase/ssr INSTEAD OF THE REGULAR CLIENT:
 * The regular createClient() stores sessions in localStorage — which only
 * exists in the browser. @supabase/ssr stores sessions in cookies so the
 * server can read them on every request. This is required for SSR auth.
 *
 * INSTALL: pnpm add @supabase/ssr
 */

import { createServerClient } from '@supabase/ssr';
import type { Handle }         from '@sveltejs/kit';
import {
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
} from '$env/static/private';
import type { Database } from '$lib/types/database';

export const handle: Handle = async ({ event, resolve }) => {

  // 1. Create a Supabase client that is scoped to this request.
  //    It reads the session JWT from the request cookie and can write
  //    refreshed tokens back via Set-Cookie in the response.
  event.locals.supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return event.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' });
          });
        },
      },
    },
  );

  // 2. Extract session — getUser() re-validates the JWT with Supabase
  //    on every request, not just reads the cookie. This is more secure
  //    than getSession() which trusts the cookie without re-validating.
  const { data: { user } } = await event.locals.supabase.auth.getUser();

  // Build a session-like object that matches the App.Locals type
  event.locals.session = user
    ? { user, access_token: '', token_type: 'bearer', expires_in: 0, refresh_token: '' }
    : null;

  // 3. Check admin allowlist — only if there is a logged-in user
  event.locals.isAdmin = false;

  if (user?.email) {
    const { data } = await event.locals.supabase
      .from('allowed_admins')
      .select('email')
      .eq('email', user.email)
      .single();

    event.locals.isAdmin = !!data;
  }

  // 4. Resolve the request — pass auth header for SSR token refresh
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      // Allow Supabase's content-range header through for realtime
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};