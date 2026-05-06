/**
 * src/lib/server/notifications.ts
 *
 * Discord webhook notification helper.
 * SERVER-ONLY — lives in $lib/server/ so it can safely read
 * DISCORD_WEBHOOK_URL from $env/static/private.
 *
 * PROBLEMS FIXED FROM YOUR VERSION:
 *
 * 1. Field name mismatch
 *    Your notifications.ts accepted `lead.service` but the data coming
 *    from the API route uses `lead.service_requested` (matching the DB
 *    column name). This caused the "Service Requested" field in Discord
 *    to show as undefined.
 *
 * 2. Fire-and-forget without surfacing errors
 *    Your version used .catch() which silently swallowed errors during
 *    development. The fixed version is properly async so you can await
 *    it in the API route and see real error messages in the terminal.
 *    The API route still calls it fire-and-forget (no await at the
 *    call site) — but the function itself is properly awaitable so
 *    errors are logged clearly.
 *
 * 3. No response status check
 *    Your version only caught network errors (.catch). It did not check
 *    if Discord returned a 4xx/5xx — for example a 401 (bad webhook URL)
 *    or 400 (malformed payload) would silently succeed. Fixed by checking
 *    res.ok and logging the Discord error body.
 */

import { DISCORD_WEBHOOK_URL } from '$env/static/private';

interface LeadNotification {
  id:                string;
  name:              string;
  email:             string;
  business:          string | null;
  service_requested: string;   // FIXED: was `service` in your version — must match DB column
  message:           string;
}

export async function notifyDiscord(lead: LeadNotification): Promise<void> {
  // Guard: if the env var is missing, log clearly and bail.
  // This surfaces immediately in dev — you'll see it in the terminal.
  if (!DISCORD_WEBHOOK_URL) {
    console.error(
      '[Discord] DISCORD_WEBHOOK_URL is not set in .env. ' +
      'Check that the variable name matches exactly (no PUBLIC_ prefix).'
    );
    return;
  }

  const embed = {
    title:  '🌙 New Lead — Luna Labs',
    color:  0x8A2BE2, // luna-purple brand colour
    fields: [
      { name: '👤 Name',     value: lead.name,                     inline: true  },
      { name: '📧 Email',    value: lead.email,                    inline: true  },
      { name: '🏢 Business', value: lead.business || '—',          inline: true  },
      { name: '🛠 Service',  value: lead.service_requested,        inline: false },
      { name: '💬 Message',  value: lead.message.slice(0, 1000),   inline: false },
    ],
    footer:    { text: `Lead ID: ${lead.id}` },
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ embeds: [embed] }),
    });

    if (!res.ok) {
      // Read the error body so you can see exactly what Discord rejected
      const errorText = await res.text();
      console.error(
        `[Discord] Webhook returned ${res.status}:`,
        errorText
      );
    } else {
      console.log('[Discord] Notification sent for lead:', lead.id);
    }
  } catch (err) {
    // Network-level failure (DNS, timeout, etc.)
    console.error('[Discord] Network error sending notification:', err);
  }
}