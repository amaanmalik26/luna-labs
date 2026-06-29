/**
 * src/routes/admin/signout/+server.ts
 * POST /admin/signout — clears the Supabase session.
 */
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ADMIN_SESSION_COOKIE = 'luna_admin_session_started_at';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	await locals.supabase.auth.signOut();
	cookies.delete(ADMIN_SESSION_COOKIE, { path: '/' });
	throw redirect(303, '/admin/login');
};
