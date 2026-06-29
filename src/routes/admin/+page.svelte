<script lang="ts">
	import { resolve } from '$app/paths';
	import { ArrowUpRight, CheckCircle2, Inbox, Send, UsersRound } from 'lucide-svelte';
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
	};

	let { data }: { data: PageData } = $props();
	const leads = $derived(data.leads as Lead[]);
	const maxTrend = $derived(Math.max(...data.trend.map((day) => day.count), 1));
	const stats = $derived([
		{ label: 'Total leads', value: data.stats.total, icon: UsersRound },
		{ label: 'New', value: data.stats.newLeads, icon: Inbox },
		{ label: 'Contacted', value: data.stats.contacted, icon: Send },
		{ label: 'Closed', value: data.stats.closed, icon: CheckCircle2 }
	]);

	function barHeight(count: number) {
		return `${Math.max((count / maxTrend) * 100, 3)}%`;
	}

	function formatDay(iso: string) {
		return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
	}

	function timeAgo(iso: string) {
		const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
		if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d ago`;
		if (minutes >= 60) return `${Math.floor(minutes / 60)}h ago`;
		return `${Math.max(minutes, 0)}m ago`;
	}
</script>

<svelte:head><title>Admin Dashboard | Luna Labs</title></svelte:head>

<div class="admin-page">
	<header class="page-head">
		<div>
			<p class="admin-eyebrow">Overview / Live operations</p>
			<h1 class="admin-heading">Dashboard</h1>
			<p class="admin-copy">A concise view of inquiries, activity, and service demand.</p>
		</div>
		<a class="admin-button" href={resolve('/admin/leads')}>
			Open leads <ArrowUpRight size={14} />
		</a>
	</header>

	<section class="stat-grid" aria-label="Lead statistics">
		{#each stats as stat (stat.label)}
			{@const StatIcon = stat.icon}
			<article class="stat-block">
				<div>
					<span class="admin-label">{stat.label}</span><StatIcon size={17} strokeWidth={1.4} />
				</div>
				<strong>{stat.value}</strong>
			</article>
		{/each}
	</section>

	<div class="analytics-grid">
		<section class="admin-panel trend-panel">
			<header class="panel-head">
				<div>
					<p class="admin-label">Lead volume</p>
					<h2>Last 14 days</h2>
				</div>
				<span class="admin-meta">{data.stats.total} total</span>
			</header>
			<div class="chart" role="img" aria-label="Lead volume during the last 14 days">
				{#each data.trend as day, index (day.date)}
					<div class="bar-column" title={`${formatDay(day.date)}: ${day.count} leads`}>
						<span>{day.count || ''}</span>
						<div class:has-data={day.count > 0} style={`height: ${barHeight(day.count)}`}></div>
						<small>{index % 3 === 0 ? formatDay(day.date) : ''}</small>
					</div>
				{/each}
			</div>
		</section>

		<section class="admin-panel service-panel">
			<header class="panel-head">
				<div>
					<p class="admin-label">Demand</p>
					<h2>By service</h2>
				</div>
			</header>
			<div class="service-list">
				{#each Object.entries(data.byService).sort((a, b) => b[1] - a[1]) as [service, count] (service)}
					{@const percentage = data.stats.total ? Math.round((count / data.stats.total) * 100) : 0}
					<div>
						<p><span>{service}</span><strong>{count}</strong></p>
						<div class="meter"><span style={`width: ${percentage}%`}></span></div>
					</div>
				{:else}
					<p class="empty-copy">Service demand will appear after the first inquiry.</p>
				{/each}
			</div>
		</section>
	</div>

	<section class="admin-panel recent-panel">
		<header class="panel-head">
			<div>
				<p class="admin-label">Inbox</p>
				<h2>Recent leads</h2>
			</div>
			<a href={resolve('/admin/leads')}>View all <ArrowUpRight size={13} /></a>
		</header>
		<div class="admin-table-wrap">
			<table class="admin-table">
				<thead
					><tr
						><th>Lead</th><th>Service</th><th class="optional">Business</th><th>Status</th><th
							class="optional">Received</th
						></tr
					></thead
				>
				<tbody>
					{#each leads as lead (lead.id)}
						<tr>
							<td><strong>{lead.name}</strong><small>{lead.email}</small></td>
							<td>{lead.service_requested}</td>
							<td class="optional">{lead.business ?? '-'}</td>
							<td><span class="admin-status" data-status={lead.status}>{lead.status}</span></td>
							<td class="optional muted">{timeAgo(lead.created_at)}</td>
						</tr>
					{:else}
						<tr><td colspan="5" class="empty-cell">No inquiries have arrived yet.</td></tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	.page-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 28px;
		margin-bottom: 34px;
	}
	.page-head h1 {
		margin-top: 10px;
	}
	.page-head .admin-copy {
		margin-top: 10px;
	}
	.stat-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border: 1px solid var(--admin-line);
		border-radius: 6px;
		overflow: hidden;
	}
	.stat-block {
		min-height: 142px;
		padding: 20px;
		border-right: 1px solid var(--admin-line);
		background: var(--admin-surface);
	}
	.stat-block:last-child {
		border-right: 0;
	}
	.stat-block div {
		display: flex;
		justify-content: space-between;
		color: var(--admin-faint);
	}
	.stat-block strong {
		display: block;
		margin-top: 38px;
		font-family: 'Barlow', sans-serif;
		font-size: 38px;
		font-weight: 500;
	}
	.analytics-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(260px, 0.8fr);
		gap: 16px;
		margin-top: 16px;
	}
	.panel-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 19px 20px;
		border-bottom: 1px solid var(--admin-line);
	}
	.panel-head h2 {
		margin-top: 4px;
		font-family: 'Barlow', sans-serif;
		font-size: 18px;
		font-weight: 500;
	}
	.panel-head a {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 11px;
		color: var(--admin-muted);
	}
	.chart {
		display: flex;
		height: 210px;
		align-items: end;
		gap: 7px;
		padding: 28px 20px 18px;
	}
	.bar-column {
		display: grid;
		height: 100%;
		flex: 1;
		grid-template-rows: 17px 1fr 18px;
		align-items: end;
		text-align: center;
	}
	.bar-column > span {
		align-self: start;
		font:
			9px 'JetBrains Mono',
			monospace;
		color: var(--admin-faint);
	}
	.bar-column > div {
		min-height: 3px;
		background: #242428;
		transition: height 300ms ease;
	}
	.bar-column > div.has-data {
		background: #d7d7dc;
	}
	.bar-column small {
		padding-top: 7px;
		font:
			8px 'JetBrains Mono',
			monospace;
		color: #55555c;
		white-space: nowrap;
	}
	.service-list {
		display: grid;
		gap: 20px;
		padding: 24px 20px;
	}
	.service-list p {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 12px;
		color: var(--admin-muted);
	}
	.service-list strong {
		color: #d4d4d8;
	}
	.meter {
		height: 2px;
		margin-top: 9px;
		background: #29292d;
	}
	.meter span {
		display: block;
		height: 100%;
		background: #d4d4d8;
	}
	.empty-copy {
		line-height: 1.7;
	}
	.recent-panel {
		margin-top: 16px;
	}
	.admin-table strong,
	.admin-table small {
		display: block;
	}
	.admin-table strong {
		font-weight: 500;
		color: #e4e4e7;
	}
	.admin-table small,
	.muted {
		margin-top: 4px;
		color: var(--admin-faint);
	}
	.empty-cell {
		height: 120px;
		text-align: center;
		color: var(--admin-muted);
	}
	@media (max-width: 900px) {
		.stat-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.stat-block:nth-child(2) {
			border-right: 0;
		}
		.stat-block:nth-child(-n + 2) {
			border-bottom: 1px solid var(--admin-line);
		}
		.analytics-grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 640px) {
		.page-head {
			align-items: start;
			flex-direction: column;
		}
		.page-head .admin-button {
			width: 100%;
		}
		.stat-block {
			min-height: 120px;
		}
		.stat-block strong {
			margin-top: 25px;
		}
		.optional {
			display: none;
		}
	}
</style>
