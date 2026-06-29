/**
 * src/routes/admin/+layout.server.ts
 *
 * Protects EVERY route under /admin.
 * SvelteKit runs this before rendering any admin page.
 * If the user is not an admin, they are redirected to /admin/login.
 *
 * event.locals.isAdmin is set in hooks.server.ts — it is true only when:
 *   1. A valid Supabase session exists (user is logged in)
 *   2. The session user's email is in the allowed_admins table
 *
 * This file also passes the session and leads data down to child pages.
 */

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Guard — redirect to login if not an admin
	// Exception: the login page itself is under /admin/login —
	// we skip the guard there so the login page can actually render.
	const isLoginPage = url.pathname === '/admin/login';

	if (!isLoginPage && !locals.isAdmin) {
		throw redirect(303, '/admin/login');
	}

	// If somehow an admin lands on /admin/login, send them to dashboard
	if (isLoginPage && locals.isAdmin) {
		throw redirect(303, '/admin');
	}

	return {
		session: locals.session,
		isAdmin: locals.isAdmin
	};
};
