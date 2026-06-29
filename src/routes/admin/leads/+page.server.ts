/**
 * src/routes/admin/leads/+page.server.ts
 */
import { error as kitError, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createServiceClient } from '$lib/server/supabase';
import type { LeadStatus, ServiceType } from '$lib/types/database';

const LEAD_STATUSES = new Set<LeadStatus>(['new', 'contacted', 'closed']);

export const load: PageServerLoad = async ({ url, locals }) => {
	if (!locals.isAdmin) kitError(403, 'Forbidden');

	const supabase = createServiceClient();

	// Filters from URL search params
	const statusFilter = url.searchParams.get('status') ?? 'all';
	const serviceFilter = url.searchParams.get('service') ?? 'all';
	const search = url.searchParams.get('q') ?? '';

	let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

	if (statusFilter !== 'all') {
		query = query.eq('status', statusFilter as LeadStatus);
	}
	if (serviceFilter !== 'all') {
		query = query.eq('service_requested', serviceFilter as ServiceType);
	}

	const { data: leads } = await query;
	const allLeads = leads ?? [];

	// Client-side search filter (name or email contains search string)
	const filtered = search
		? allLeads.filter(
				(l) =>
					l.name.toLowerCase().includes(search.toLowerCase()) ||
					l.email.toLowerCase().includes(search.toLowerCase())
			)
		: allLeads;

	return { leads: filtered, statusFilter, serviceFilter, search };
};

export const actions: Actions = {
	// Update a lead's status
	updateStatus: async ({ request, locals }) => {
		if (!locals.isAdmin) return fail(403, { error: 'Forbidden.' });

		const form = await request.formData();
		const id = form.get('id')?.toString();
		const status = form.get('status')?.toString() as LeadStatus;

		if (!id || !status) return fail(422, { error: 'Missing fields.' });
		if (!LEAD_STATUSES.has(status)) return fail(422, { error: 'Invalid status.' });

		const supabase = createServiceClient();
		const { error } = await supabase.from('leads').update({ status }).eq('id', id);

		if (error) return fail(500, { error: 'Update failed.' });

		return { success: true };
	}
};
