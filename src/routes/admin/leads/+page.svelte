<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- filtered navigation appends runtime query parameters */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ChevronDown, Mail, Search } from 'lucide-svelte';
	import { SvelteURLSearchParams } from 'svelte/reactivity';
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
	let search = $state('');
	let statusFilter = $state('all');
	let serviceFilter = $state('all');
	let expandedId = $state<string | null>(null);
	let searchTimer: ReturnType<typeof setTimeout>;

	$effect(() => {
		search = data.search ?? '';
		statusFilter = data.statusFilter ?? 'all';
		serviceFilter = data.serviceFilter ?? 'all';
	});

	function applyFilters() {
		const params = new SvelteURLSearchParams();
		if (statusFilter !== 'all') params.set('status', statusFilter);
		if (serviceFilter !== 'all') params.set('service', serviceFilter);
		if (search.trim()) params.set('q', search.trim());
		goto(`${resolve('/admin/leads')}?${params.toString()}`, { keepFocus: true });
	}

	function queueSearch() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(applyFilters, 350);
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleString('en-GB', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head><title>Leads | Luna Labs Admin</title></svelte:head>

<div class="admin-page">
	<header class="page-head">
		<div>
			<p class="admin-eyebrow">Inquiries / Pipeline</p>
			<h1 class="admin-heading">Leads</h1>
			<p class="admin-copy">
				Review project requests and move each conversation through the pipeline.
			</p>
		</div>
		<span class="result-count">{leads.length.toString().padStart(2, '0')} results</span>
	</header>

	<section class="filter-bar" aria-label="Lead filters">
		<label class="search-field">
			<span class="sr-only">Search leads</span>
			<Search size={15} />
			<input
				type="search"
				bind:value={search}
				oninput={queueSearch}
				placeholder="Search name or email"
			/>
		</label>
		<label>
			<span class="sr-only">Filter by status</span>
			<select bind:value={statusFilter} onchange={applyFilters}>
				<option value="all">All statuses</option>
				<option value="new">New</option>
				<option value="contacted">Contacted</option>
				<option value="closed">Closed</option>
			</select>
		</label>
		<label>
			<span class="sr-only">Filter by service</span>
			<select bind:value={serviceFilter} onchange={applyFilters}>
				<option value="all">All services</option>
				<option value="Web Systems">Web Systems</option>
				<option value="UI/UX Design">UI/UX Design</option>
				<option value="Custom SaaS">Custom SaaS</option>
				<option value="Other">Other</option>
			</select>
		</label>
	</section>

	<section class="admin-panel leads-panel">
		<div class="admin-table-wrap">
			<table class="admin-table">
				<thead>
					<tr
						><th>Lead</th><th class="optional">Service</th><th class="optional-wide">Business</th
						><th>Status</th><th class="optional-wide">Received</th><th
							><span class="sr-only">Message</span></th
						></tr
					>
				</thead>
				<tbody>
					{#each leads as lead (lead.id)}
						<tr class:expanded={expandedId === lead.id}>
							<td>
								<strong>{lead.name}</strong>
								<a href={`mailto:${lead.email}`}><Mail size={11} /> {lead.email}</a>
							</td>
							<td class="optional muted">{lead.service_requested}</td>
							<td class="optional-wide muted">{lead.business ?? '-'}</td>
							<td>
								<form method="POST" action="?/updateStatus" use:enhance>
									<input type="hidden" name="id" value={lead.id} />
									<label class="status-control" data-status={lead.status}>
										<span class="sr-only">Update status for {lead.name}</span>
										<select
											name="status"
											onchange={(event) =>
												(event.currentTarget.closest('form') as HTMLFormElement)?.requestSubmit()}
										>
											<option value="new" selected={lead.status === 'new'}>New</option>
											<option value="contacted" selected={lead.status === 'contacted'}
												>Contacted</option
											>
											<option value="closed" selected={lead.status === 'closed'}>Closed</option>
										</select>
									</label>
								</form>
							</td>
							<td class="optional-wide muted date-cell">{formatDate(lead.created_at)}</td>
							<td class="action-cell">
								<button
									onclick={() => (expandedId = expandedId === lead.id ? null : lead.id)}
									aria-expanded={expandedId === lead.id}
									aria-label={`View message from ${lead.name}`}
								>
									<ChevronDown size={16} class={expandedId === lead.id ? 'rotate' : ''} />
								</button>
							</td>
						</tr>
						{#if expandedId === lead.id}
							<tr class="message-row"
								><td colspan="6"
									><p class="admin-label">Project note</p>
									<div>{lead.message}</div></td
								></tr
							>
						{/if}
					{:else}
						<tr
							><td colspan="6" class="empty-cell"
								>{data.search || data.statusFilter !== 'all' || data.serviceFilter !== 'all'
									? 'No leads match these filters.'
									: 'No inquiries have arrived yet.'}</td
							></tr
						>
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
		gap: 24px;
		margin-bottom: 32px;
	}
	.page-head h1 {
		margin-top: 10px;
	}
	.page-head .admin-copy {
		margin-top: 10px;
		max-width: 620px;
	}
	.result-count {
		font:
			10px 'JetBrains Mono',
			monospace;
		letter-spacing: 0.15em;
		color: var(--admin-faint);
		text-transform: uppercase;
	}
	.filter-bar {
		display: grid;
		grid-template-columns: minmax(240px, 1fr) 190px 210px;
		gap: 8px;
		margin-bottom: 14px;
	}
	.filter-bar label {
		position: relative;
	}
	.filter-bar input,
	.filter-bar select {
		width: 100%;
		height: 42px;
		border: 1px solid var(--admin-line);
		border-radius: 4px;
		background: var(--admin-surface);
		padding: 0 12px;
		color: #d4d4d8;
		font-size: 12px;
		outline: none;
	}
	.filter-bar input:focus,
	.filter-bar select:focus {
		border-color: #63636b;
	}
	.search-field :global(svg) {
		position: absolute;
		top: 13px;
		left: 13px;
		color: var(--admin-faint);
	}
	.search-field input {
		padding-left: 38px;
	}
	.filter-bar select option {
		background: #121214;
	}
	.leads-panel {
		overflow: hidden;
	}
	.admin-table strong {
		display: block;
		font-weight: 500;
		color: #e4e4e7;
	}
	.admin-table td > a {
		display: flex;
		align-items: center;
		gap: 5px;
		margin-top: 5px;
		font-size: 11px;
		color: var(--admin-faint);
	}
	.admin-table td > a:hover {
		color: #d4d4d8;
	}
	.muted {
		color: var(--admin-muted);
	}
	.date-cell {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
	}
	.status-control {
		position: relative;
		display: inline-flex;
		align-items: center;
	}
	.status-control::before {
		position: absolute;
		left: 9px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		content: '';
		pointer-events: none;
	}
	.status-control[data-status='new'] {
		color: var(--admin-warning);
	}
	.status-control[data-status='contacted'] {
		color: #9faecc;
	}
	.status-control[data-status='closed'] {
		color: var(--admin-positive);
	}
	.status-control select {
		appearance: none;
		border: 1px solid var(--admin-line-strong);
		border-radius: 4px;
		background: #101012;
		padding: 7px 9px 7px 24px;
		color: currentColor;
		font:
			9px 'JetBrains Mono',
			monospace;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.status-control option {
		background: #121214;
		color: white;
	}
	.action-cell {
		width: 50px;
		text-align: right;
	}
	.action-cell button {
		display: inline-flex;
		padding: 8px;
		color: var(--admin-faint);
	}
	.action-cell :global(svg) {
		transition: transform 160ms ease;
	}
	.action-cell :global(svg.rotate) {
		transform: rotate(180deg);
	}
	tr.expanded {
		background: #151517;
	}
	.message-row td {
		padding: 0 18px 20px;
		background: #151517;
	}
	.message-row div {
		margin-top: 9px;
		border-left: 2px solid #57575f;
		padding: 3px 0 3px 14px;
		max-width: 900px;
		color: #aaaab2;
		font-size: 13px;
		line-height: 1.8;
	}
	.empty-cell {
		height: 160px;
		text-align: center;
		color: var(--admin-muted);
	}
	@media (max-width: 850px) {
		.filter-bar {
			grid-template-columns: 1fr 1fr;
		}
		.search-field {
			grid-column: 1 / -1;
		}
		.optional-wide {
			display: none;
		}
	}
	@media (max-width: 600px) {
		.page-head {
			align-items: start;
			flex-direction: column;
		}
		.filter-bar {
			grid-template-columns: 1fr;
		}
		.search-field {
			grid-column: auto;
		}
		.optional {
			display: none;
		}
	}
</style>
