/**
 * src/routes/admin/signout/+server.ts
 * POST /admin/signout — clears the Supabase session.
 */
import { redirect }          from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  await locals.supabase.auth.signOut();
  throw redirect(303, '/admin/login');
};