<script lang="ts">
  import { enhance }              from '$app/forms';
  import { goto }                 from '$app/navigation';
  import { resolve }              from '$app/paths';
  import { SvelteURLSearchParams } from 'svelte/reactivity';
  import type { PageData }        from './$types';

  type LeadStatus = 'new' | 'contacted' | 'closed';

  interface Lead {
    id: string;
    name: string;
    email: string;
    service_requested: string;
    business?: string | null;
    status: LeadStatus;
    created_at: string;
    message: string;
  }

  let { data }: { data: PageData } = $props();
  const leads = $derived(data.leads as Lead[]);

  // ── Filter state synced to URL params ──────────────────────────
  let search        = $state(data.search ?? '');
  let statusFilter  = $state(data.statusFilter ?? 'all');
  let serviceFilter = $state(data.serviceFilter ?? 'all');

  let searchTimer: ReturnType<typeof setTimeout>;

  function applyFilters() {
    const params = new SvelteURLSearchParams();
    if (statusFilter  !== 'all') params.set('status',  statusFilter);
    if (serviceFilter !== 'all') params.set('service', serviceFilter);
    if (search.trim())           params.set('q',       search.trim());
    goto(resolve(`/admin/leads?${params.toString()}`), { keepFocus: true });
  }

  function onSearchInput() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFilters, 350);
  }

  // ── Expanded row for full message ──────────────────────────────
  let expandedId = $state<string | null>(null);

  // ── Status badge ───────────────────────────────────────────────
  const STATUS_STYLE = {
    new:       'bg-luna-gold/15 text-luna-gold border-luna-gold/30',
    contacted: 'bg-luna-blue/15 text-blue-300 border-blue-500/30',
    closed:    'bg-green-500/15 text-green-400 border-green-500/30',
  };

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
</script>

<div class="mb-6">
  <h1 class="font-black text-lg tracking-tight">Leads</h1>
  <p class="text-luna-text-muted text-xs">{leads.length} result{leads.length !== 1 ? 's' : ''}</p>
</div>

<div class="space-y-6 max-w-7xl">

  <!-- ── Filters bar ──────────────────────────────────────────── -->
  <div class="flex flex-wrap gap-3 items-center">

    <!-- Search -->
    <div class="relative flex-1 min-w-48">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luna-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        placeholder="Search name or email..."
        bind:value={search}
        oninput={onSearchInput}
        class="filter-input pl-9"
        aria-label="Search leads"
      />
    </div>

    <!-- Status filter -->
    <select
      bind:value={statusFilter}
      onchange={applyFilters}
      class="filter-input"
      aria-label="Filter by status"
    >
      <option value="all">All statuses</option>
      <option value="new">New</option>
      <option value="contacted">Contacted</option>
      <option value="closed">Closed</option>
    </select>

    <!-- Service filter -->
    <select
      bind:value={serviceFilter}
      onchange={applyFilters}
      class="filter-input"
      aria-label="Filter by service"
    >
      <option value="all">All services</option>
      <option value="Web Systems">Web Systems</option>
      <option value="UI/UX Design">UI/UX Design</option>
      <option value="Custom SaaS">Custom SaaS</option>
      <option value="Other">Other</option>
    </select>
  </div>

  <!-- ── Leads table ──────────────────────────────────────────── -->
  <div class="luna-glass rounded-2xl overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm" aria-label="Leads table">
        <thead>
          <tr style="border-bottom: 1px solid var(--color-luna-border);">
            <th class="th-cell">Lead</th>
            <th class="th-cell hidden md:table-cell">Service</th>
            <th class="th-cell hidden lg:table-cell">Business</th>
            <th class="th-cell">Status</th>
            <th class="th-cell hidden lg:table-cell">Received</th>
            <th class="th-cell text-right">Message</th>
          </tr>
        </thead>
        <tbody>
          {#each leads as lead (lead.id)}
            <tr
              class="transition-colors hover:bg-white/2"
              style="border-bottom: 1px solid var(--color-luna-border);"
            >
              <!-- Name + email -->
              <td class="td-cell">
                <p class="font-semibold text-white">{lead.name}</p>
                <a href={`mailto:${lead.email}`} class="text-luna-text-muted text-xs hover:text-luna-neon transition-colors">
                  {lead.email}
                </a>
              </td>

              <!-- Service -->
              <td class="td-cell hidden md:table-cell text-luna-text-muted text-xs">
                {lead.service_requested}
              </td>

              <!-- Business -->
              <td class="td-cell hidden lg:table-cell text-luna-text-muted text-xs">
                {lead.business ?? '—'}
              </td>

              <!-- Status — inline form update -->
              <td class="td-cell">
                <form
                  method="POST"
                  action="?/updateStatus"
                  use:enhance
                >
                  <input type="hidden" name="id" value={lead.id} />
                  <select
                    name="status"
                    class={`status-select ${STATUS_STYLE[lead.status]}`}
                    onchange={(e) => {
                      const form = (e.target as HTMLElement).closest('form');
                      form?.requestSubmit();
                    }}
                    aria-label={`Update status for ${lead.name}`}
                  >
                    <option value="new"       selected={lead.status === 'new'}>New</option>
                    <option value="contacted" selected={lead.status === 'contacted'}>Contacted</option>
                    <option value="closed"    selected={lead.status === 'closed'}>Closed</option>
                  </select>
                </form>
              </td>

              <!-- Date -->
              <td class="td-cell hidden lg:table-cell text-luna-text-muted text-xs">
                {formatDate(lead.created_at)}
              </td>

              <!-- Expand message -->
              <td class="td-cell text-right">
                <button
                  onclick={() => expandedId = expandedId === lead.id ? null : lead.id}
                  class="text-[10px] font-bold uppercase tracking-wider text-luna-text-muted hover:text-luna-neon transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                  aria-expanded={expandedId === lead.id}
                >
                  {expandedId === lead.id ? 'Close' : 'View'}
                </button>
              </td>
            </tr>

            <!-- Expanded message row -->
            {#if expandedId === lead.id}
              <tr style="border-bottom: 1px solid var(--color-luna-border);">
                <td colspan="6" class="px-6 py-5">
                  <div
                    class="rounded-xl p-4 text-sm text-luna-text-muted leading-relaxed"
                    style="background: rgba(255,255,255,0.03); border: 1px solid var(--color-luna-border);"
                  >
                    <p class="text-luna-gold text-[10px] font-bold uppercase tracking-widest mb-2">Message from {lead.name}</p>
                    {lead.message}
                  </div>
                </td>
              </tr>
            {/if}

          {:else}
            <tr>
              <td colspan="6" class="text-center py-16 text-luna-text-muted text-sm">
                {#if data.search || data.statusFilter !== 'all' || data.serviceFilter !== 'all'}
                  No leads match your filters.
                {:else}
                  No leads yet. Share the site and they'll appear here.
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

</div>

<style>
  .th-cell {
    padding: 12px 20px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-luna-text-muted);
    white-space: nowrap;
  }
  .td-cell {
    padding: 14px 20px;
    vertical-align: middle;
  }
  .filter-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--color-luna-border);
    border-radius: 10px;
    padding: 9px 12px;
    color: #fff;
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
  }
  .filter-input:focus {
    border-color: rgba(0,240,255,0.35);
  }
  .filter-input option { background: #1E143C; }
  .status-select {
    appearance: none;
    padding: 4px 10px;
    border-radius: 9999px;
    border: 1px solid;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.2s;
    background: transparent;
  }
  .status-select:focus { outline: none; opacity: 0.85; }
  .status-select option { background: #1E143C; color: #fff; }
</style>