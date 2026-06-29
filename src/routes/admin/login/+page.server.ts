/**
 * src/routes/admin/login/+page.server.ts
 *
 * WHY MAGIC LINK AS PRIMARY AUTH:
 * For a 2-person admin system, magic link (passwordless email) is the
 * best choice:
 *   1. No passwords to forget, rotate, or have breached
 *   2. Supabase handles the token generation and expiry
 *   3. Only emails in allowed_admins can do anything useful after login
 *   4. One-click login from email — fastest possible UX
 *
 * Password login is kept as a fallback for offline/email-unavailable
 * situations. Both go through the same allowlist check in hooks.server.ts.
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { siteDetails } from '$lib/data/site';

const ADMIN_SESSION_COOKIE = 'luna_admin_session_started_at';
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

function adminCookieOptions(url: URL) {
	return {
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: url.protocol === 'https:',
		path: '/',
		maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
	};
}

function adminRedirectOrigin(url: URL): string {
	const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
	if (isLocalhost) return url.origin;

	return (env.SITE_URL?.trim() || siteDetails.url).replace(/\/$/, '');
}

export const load: PageServerLoad = async ({ locals }) => {
	// If already logged in as admin, skip the login page
	if (locals.isAdmin) throw redirect(303, '/admin');
	return {};
};

export const actions: Actions = {
	// Magic link — sends a one-time login link to the email
	magiclink: async ({ request, locals, url }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString().trim().toLowerCase();

		if (!email || !email.includes('@')) {
			return fail(422, { error: 'Please enter a valid email address.' });
		}

		const { error } = await locals.supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${adminRedirectOrigin(url)}/admin`,
				shouldCreateUser: false // Don't create new Supabase Auth users
			}
		});

		if (error) {
			return fail(500, { error: 'Failed to send magic link. Please try again.' });
		}

		return { magicLinkSent: true, email };
	},

	// Password login — fallback method
	password: async ({ request, locals, cookies, url }) => {
		const form = await request.formData();
		const email = form.get('email')?.toString().trim().toLowerCase();
		const password = form.get('password')?.toString();

		if (!email || !password) {
			return fail(422, { error: 'Email and password are required.' });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			// Generic message — don't tell attackers whether the email exists
			return fail(401, { error: 'Invalid credentials. Please try again.' });
		}

		// hooks.server.ts will check isAdmin on the next request
		cookies.set(ADMIN_SESSION_COOKIE, String(Date.now()), adminCookieOptions(url));
		throw redirect(303, '/admin');
	}
};
