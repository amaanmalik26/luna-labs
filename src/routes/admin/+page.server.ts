/**
 * src/routes/admin/+page.server.ts
 * Fetches all data the dashboard needs in one server-side load.
 * Uses the service client (bypasses RLS) since this is admin code.
 */
import type { PageServerLoad } from './$types';
import { createServiceClient } from '$lib/server/supabase';

export const load: PageServerLoad = async () => {
  const supabase = createServiceClient();

  // Fetch all leads — we compute stats client-side from this
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const allLeads = leads ?? [];

  // ── Pre-compute stats on the server ─────────────────────────────
  const total     = allLeads.length;
  const newLeads  = allLeads.filter(l => l.status === 'new').length;
  const contacted = allLeads.filter(l => l.status === 'contacted').length;
  const closed    = allLeads.filter(l => l.status === 'closed').length;

  // Leads by service type
  const byService = allLeads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.service_requested] = (acc[lead.service_requested] ?? 0) + 1;
    return acc;
  }, {});

  // Leads per day for the last 14 days (for the trend chart)
  const today = new Date();
  const last14: { date: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = allLeads.filter(l => l.created_at.slice(0, 10) === key).length;
    last14.push({ date: key, count });
  }

  return {
    leads:      allLeads.slice(0, 10), // recent 10 for the table
    stats:      { total, newLeads, contacted, closed },
    byService,
    trend:      last14,
  };
};