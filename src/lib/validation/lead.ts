/**
 * src/lib/validation/lead.ts
 *
 * Single source of truth for lead validation rules.
 * Imported by BOTH:
 *   1. RequestQuoteForm.svelte  — client-side field validation (UX)
 *   2. /api/leads/+server.ts   — server-side validation (security)
 *
 * WHY SHARE THE SCHEMA:
 * If the rules live only on the client, a bad actor can bypass them with
 * a raw POST. If they live only on the server, the form can't give instant
 * feedback. Sharing from one file guarantees both layers always agree.
 *
 * Zod runs in both environments — it's a zero-dependency pure-TS library.
 */

import { z } from 'zod';

export const SERVICE_OPTIONS = [
  'Web Systems',
  'UI/UX Design',
  'Custom SaaS',
  'Other',
] as const;

export const leadSchema = z.object({
  name: z
    .string()
    .min(2,  { message: 'Name must be at least 2 characters.'  })
    .max(100, { message: 'Name must be under 100 characters.'  })
    .trim(),

  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .toLowerCase()
    .trim(),

  business: z
    .string()
    .max(100, { message: 'Business name must be under 100 characters.' })
    .trim()
    .optional()
    .or(z.literal('')),   // allow empty string from the form

  service_requested: z.enum(SERVICE_OPTIONS, {
    message: 'Please select a service.',
  }),

  message: z
    .string()
    .min(10,  { message: 'Message must be at least 10 characters.'   })
    .max(2000, { message: 'Message must be under 2000 characters.'   })
    .trim(),
});

// Infer the TypeScript type from the schema — used for form state typing
export type LeadFormData = z.infer<typeof leadSchema>;

// Field-level error map type — used by the form component
export type LeadFormErrors = Partial<Record<keyof LeadFormData, string>>;
