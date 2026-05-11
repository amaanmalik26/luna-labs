/**
 * src/routes/api/leads/+server.ts
 * POST /api/leads
 *
 * Uses createServiceClient() which bypasses RLS entirely.
 * This is correct for server-side trusted code that:
 *   1. Has already validated input with Zod
 *   2. Has already rate-limited by IP
 *   3. Never exposes the secret key to the browser
 */

import { json }               from '@sveltejs/kit';
import type { RequestHandler }  from './$types';
import { leadSchema }          from '$lib/validation/lead';
import { createServiceClient } from '$lib/server/supabase';
import { notifyDiscord }       from '$lib/server/notifications';
import type { LeadInsert }     from '$lib/types/database';

// ── Rate limiter — 3 submissions per IP per 10 min ────────────────────
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now    = Date.now();
  const window = 10 * 60 * 1000;
  const hits   = (rateLimitMap.get(ip) ?? []).filter(t => now - t < window);
  if (hits.length >= 3) return true;
  rateLimitMap.set(ip, [...hits, now]);
  return false;
}

// ── POST ──────────────────────────────────────────────────────────────
export const POST: RequestHandler = async ({ request, getClientAddress }) => {

  // 1. Rate limit
  if (isRateLimited(getClientAddress())) {
    return json(
      { message: 'Too many submissions. Please wait a few minutes.' },
      { status: 429 },
    );
  }

  // 2. Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ message: 'Invalid request body.' }, { status: 400 });
  }

  // 3. Validate with Zod
  const result = leadSchema.safeParse(body);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0]);
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return json({ message: 'Validation failed.', errors: fieldErrors }, { status: 422 });
  }

  const validated = result.data;

  // 4. Insert via service client (bypasses RLS — safe because this is
  //    server-side code behind Zod validation and rate limiting)
  const supabase = createServiceClient();

  const payload: LeadInsert = {
    name:              validated.name,
    email:             validated.email,
    business:          validated.business || null,
    service_requested: validated.service_requested,
    message:           validated.message,
  };

  const { data: lead, error: dbError } = await supabase
    .from('leads')
    .insert(payload)
    .select('id')
    .single();

  if (dbError || !lead) {
    console.error(
      '[Supabase] Insert failed:',
      dbError?.message,
      dbError?.code,
      dbError?.details,
    );
    return json(
      { message: 'Failed to save your submission. Please try again.' },
      { status: 500 },
    );
  }

  console.log('[Leads] Saved:', lead.id);

  // 5. Discord — fire-and-forget
  await notifyDiscord({ ...payload, id: lead.id });

return json({ message: 'Submission received.', id: lead.id }, { status: 201 });
};