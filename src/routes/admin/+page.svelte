<script lang="ts">
  import { resolve } from '$app/paths';
  import type { PageData } from './$types';

  type LeadStatus = 'new' | 'contacted' | 'closed';

  type Lead = {
    id: string;
    name: string;
    email: string;
    service_requested: string;
    business?: string | null;
    status: LeadStatus;
    created_at: string;
    message: string;
  };

  let { data }: { data: PageData } = $props();
  const leads = $derived(data.leads as Lead[]);

  // ── Stat card definitions ────────────────────────────────────────
  const statCards = $derived([
    {
      label:   'Total Leads',
      value:   data.stats.total,
      icon:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      colour:  'text-luna-neon',
      bg:      'rgba(0,240,255,0.08)',
      border:  'rgba(0,240,255,0.15)',
    },
    {
      label:   'New',
      value:   data.stats.newLeads,
      icon:    'M12 4v16m8-8H4',
      colour:  'text-luna-gold',
      bg:      'rgba(212,175,55,0.08)',
      border:  'rgba(212,175,55,0.15)',
    },
    {
      label:   'Contacted',
      value:   data.stats.contacted,
      icon:    'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      colour:  'text-luna-blue',
      bg:      'rgba(0,102,255,0.08)',
      border:  'rgba(0,102,255,0.15)',
    },
    {
      label:   'Closed',
      value:   data.stats.closed,
      icon:    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      colour:  'text-green-400',
      bg:      'rgba(74,222,128,0.08)',
      border:  'rgba(74,222,128,0.15)',
    },
  ]);

  // ── Bar chart helpers ────────────────────────────────────────────
  const maxTrend = $derived(Math.max(...data.trend.map((d) => d.count), 1));

  function barHeight(count: number): string {
    return `${Math.max((count / maxTrend) * 100, 4)}%`;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  }

  // ── Status badge ─────────────────────────────────────────────────
  const STATUS_STYLE = {
    new:       'bg-luna-gold/15 text-luna-gold border-luna-gold/30',
    contacted: 'bg-luna-blue/15 text-blue-300 border-blue-500/30',
    closed:    'bg-green-500/15 text-green-400 border-green-500/30',
  };

  function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days > 0)  return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${mins}m ago`;
  }
</script>

<div class="space-y-8 max-w-7xl">
  <div>
    <h1 class="font-black text-lg tracking-tight">Dashboard</h1>
    <p class="text-luna-text-muted text-xs">Luna Labs lead overview</p>
  </div>

  <!-- ── Stat cards ───────────────────────────────────────────── -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {#each statCards as card (card.label)}
      <div
        class="rounded-2xl p-5 flex flex-col gap-3"
        style="background: {card.bg}; border: 1px solid {card.border};"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-widest text-luna-text-muted">{card.label}</span>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center {card.colour}" style="background: {card.bg};">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d={card.icon} />
            </svg>
          </div>
        </div>
        <p class="text-4xl font-black {card.colour}">{card.value}</p>
      </div>
    {/each}
  </div>

  <!-- ── Charts row ───────────────────────────────────────────── -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

    <!-- Trend bar chart — spans 2 cols -->
    <div class="lg:col-span-2 luna-glass rounded-2xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-black text-sm tracking-tight">Lead Volume</h2>
          <p class="text-luna-text-muted text-xs mt-0.5">Last 14 days</p>
        </div>
        <span class="text-xs text-luna-neon font-bold">{data.stats.total} total</span>
      </div>

      <!-- Bar chart -->
      <div class="flex items-end gap-1.5 h-36" role="img" aria-label="Lead volume bar chart, last 14 days">
        {#each data.trend as day (day.date)}
          <div class="flex-1 flex flex-col items-center gap-1 group">
            <div class="relative w-full flex items-end justify-center" style="height: 112px;">
              <!-- Tooltip -->
              <div class="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-luna-base border border-luna-border-hover rounded-lg px-2 py-1 text-[10px] whitespace-nowrap z-10 pointer-events-none">
                {day.count} lead{day.count !== 1 ? 's' : ''}
              </div>
              <div
                class="w-full rounded-t-sm transition-all duration-300"
                style="
                  height: {barHeight(day.count)};
                  background: {day.count > 0
                    ? 'linear-gradient(180deg, rgba(0,240,255,0.8) 0%, rgba(0,102,255,0.5) 100%)'
                    : 'rgba(255,255,255,0.05)'};
                "
              ></div>
            </div>
            <!-- Date label — show every 3rd to avoid crowding -->
            {#if data.trend.indexOf(day) % 3 === 0}
              <span class="text-[9px] text-white/20 rotate-0">{formatDate(day.date)}</span>
            {:else}
              <span class="h-3"></span>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Service breakdown donut-style -->
    <div class="luna-glass rounded-2xl p-6">
      <div class="mb-6">
        <h2 class="font-black text-sm tracking-tight">By Service</h2>
        <p class="text-luna-text-muted text-xs mt-0.5">All time</p>
      </div>

      <div class="space-y-3">
        {#each Object.entries(data.byService).sort((a,b) => b[1] - a[1]) as [service, count] (service)}
          {@const pct = data.stats.total > 0 ? Math.round((count / data.stats.total) * 100) : 0}
          <div class="space-y-1.5">
            <div class="flex justify-between text-xs">
              <span class="text-luna-text-muted font-medium">{service}</span>
              <span class="font-bold">{count}</span>
            </div>
            <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                style="width: {pct}%; background: linear-gradient(90deg, #0066FF, #8A2BE2);"
              ></div>
            </div>
          </div>
        {/each}

        {#if Object.keys(data.byService).length === 0}
          <p class="text-luna-text-muted text-xs text-center py-4">No leads yet.</p>
        {/if}
      </div>
    </div>
  </div>

  <!-- ── Recent leads table ────────────────────────────────────── -->
  <div class="luna-glass rounded-2xl overflow-hidden">
    <div class="flex items-center justify-between px-6 py-5" style="border-bottom: 1px solid var(--color-luna-border);">
      <div>
        <h2 class="font-black text-sm tracking-tight">Recent Leads</h2>
        <p class="text-luna-text-muted text-xs mt-0.5">Latest 10 submissions</p>
      </div>
      <a
        href={resolve('/admin/leads')}
        class="text-xs text-luna-neon font-bold hover:text-white transition-colors"
      >
        View all →
      </a>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm" aria-label="Recent leads">
        <thead>
          <tr style="border-bottom: 1px solid var(--color-luna-border);">
            <th class="th-cell">Name</th>
            <th class="th-cell">Service</th>
            <th class="th-cell hidden md:table-cell">Business</th>
            <th class="th-cell">Status</th>
            <th class="th-cell hidden lg:table-cell text-right">Received</th>
          </tr>
        </thead>
        <tbody>
          {#each leads as lead (lead.id)}
            <tr
              class="transition-colors hover:bg-white/2"
              style="border-bottom: 1px solid var(--color-luna-border);"
            >
              <td class="td-cell">
                <div>
                  <p class="font-semibold text-white">{lead.name}</p>
                  <p class="text-luna-text-muted text-xs">{lead.email}</p>
                </div>
              </td>
              <td class="td-cell text-luna-text-muted">{lead.service_requested}</td>
              <td class="td-cell hidden md:table-cell text-luna-text-muted">
                {lead.business ?? '—'}
              </td>
              <td class="td-cell">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border {STATUS_STYLE[lead.status]}">
                  {lead.status}
                </span>
              </td>
              <td class="td-cell hidden lg:table-cell text-right text-luna-text-muted text-xs">
                {timeAgo(lead.created_at)}
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="5" class="text-center py-12 text-luna-text-muted text-sm">
                No leads yet. Share the site!
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
  }
  .td-cell {
    padding: 14px 20px;
    vertical-align: middle;
  }
</style>