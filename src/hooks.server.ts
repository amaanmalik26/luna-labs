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
import type { Handle } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '$env/static/private';
import type { Database } from '$lib/types/database';

const ADMIN_SESSION_COOKIE = 'luna_admin_session_started_at';
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;
const ADMIN_SESSION_MAX_AGE_MS = ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
const SECURITY_HEADERS = {
	'Content-Security-Policy': [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"font-src 'self' https://fonts.gstatic.com data:",
		"img-src 'self' data: https:",
		"connect-src 'self' https://*.supabase.co wss://*.supabase.co ws://localhost:* ws://127.0.0.1:* https://vitals.vercel-insights.com",
		"frame-src 'self' https://signature-fitness-alpha.vercel.app https://motornity.pk",
		"object-src 'none'",
		"base-uri 'self'",
		"form-action 'self'",
		"frame-ancestors 'none'"
	].join('; '),
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
	'X-Frame-Options': 'DENY'
} as const;

function adminCookieOptions(url: URL) {
	return {
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: url.protocol === 'https:',
		path: '/',
		maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
	};
}

function isAuthCallback(url: URL): boolean {
	return (
		url.searchParams.has('code') ||
		url.searchParams.has('token_hash') ||
		url.searchParams.has('access_token')
	);
}

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Create a Supabase client that is scoped to this request.
	//    It reads the session JWT from the request cookie and can write
	//    refreshed tokens back via Set-Cookie in the response.
	event.locals.supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	// 2. Extract session — getUser() re-validates the JWT with Supabase
	//    on every request, not just reads the cookie. This is more secure
	//    than getSession() which trusts the cookie without re-validating.
	const {
		data: { user }
	} = await event.locals.supabase.auth.getUser();

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

	if (event.locals.isAdmin) {
		const rawStartedAt = event.cookies.get(ADMIN_SESSION_COOKIE);
		const startedAt = rawStartedAt ? Number(rawStartedAt) : NaN;
		const now = Date.now();

		if (!Number.isFinite(startedAt) && isAuthCallback(event.url)) {
			event.cookies.set(ADMIN_SESSION_COOKIE, String(now), adminCookieOptions(event.url));
		} else if (!Number.isFinite(startedAt) || now - startedAt > ADMIN_SESSION_MAX_AGE_MS) {
			await event.locals.supabase.auth.signOut();
			event.cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
			event.locals.session = null;
			event.locals.isAdmin = false;
		}
	} else if (event.cookies.get(ADMIN_SESSION_COOKIE)) {
		event.cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
	}

	// 4. Resolve the request — pass auth header for SSR token refresh
	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Allow Supabase's content-range header through for realtime
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});

	for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(header, value);
	}

	return response;
};
