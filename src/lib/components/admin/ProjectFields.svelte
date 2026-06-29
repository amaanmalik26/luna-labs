<script lang="ts">
	import type { PortfolioProject } from '$lib/portfolio';
	import { PROJECT_STATUS_OPTIONS } from '$lib/validation/project';

	let {
		project = null,
		prefix,
		defaultSort = 0
	}: { project?: PortfolioProject | null; prefix: string; defaultSort?: number } = $props();

	const statusLabels = { live: 'Live', concept: 'Concept', 'in-progress': 'In progress' };
</script>

<div class="field-grid">
	<label class="admin-field wide">
		<span class="admin-label">Project title</span>
		<input
			id={`${prefix}-title`}
			name="title"
			class="admin-input"
			value={project?.title ?? ''}
			required
		/>
	</label>
	<label class="admin-field">
		<span class="admin-label">Category</span>
		<input
			id={`${prefix}-category`}
			name="category"
			class="admin-input"
			value={project?.category ?? ''}
			placeholder="Website, platform, ordering"
			required
		/>
	</label>
	<label class="admin-field">
		<span class="admin-label">Status</span>
		<select id={`${prefix}-status`} name="status" class="admin-select">
			{#each PROJECT_STATUS_OPTIONS as status (status)}
				<option value={status} selected={status === (project?.status ?? 'concept')}
					>{statusLabels[status]}</option
				>
			{/each}
		</select>
	</label>
	<label class="admin-field">
		<span class="admin-label">Year</span>
		<input
			id={`${prefix}-year`}
			name="year"
			class="admin-input"
			value={project?.year ?? new Date().getFullYear()}
			inputmode="numeric"
			required
		/>
	</label>
	<label class="admin-field">
		<span class="admin-label">Display order</span>
		<input
			id={`${prefix}-sort`}
			name="sort_order"
			type="number"
			min="0"
			max="999"
			class="admin-input"
			value={project?.sort_order ?? defaultSort}
		/>
	</label>
	<label class="admin-field wide">
		<span class="admin-label">Website URL</span>
		<input
			id={`${prefix}-website`}
			name="website_url"
			type="url"
			class="admin-input"
			value={project?.website_url ?? ''}
			placeholder="https://example.com"
		/>
	</label>
	<label class="admin-field wide">
		<span class="admin-label">Logo URL or static path</span>
		<input
			id={`${prefix}-logo`}
			name="logo_url"
			class="admin-input"
			value={project?.logo_url ?? ''}
			placeholder="/logos/client.png"
		/>
	</label>
	<label class="admin-field wide">
		<span class="admin-label">Technology stack</span>
		<input
			id={`${prefix}-stack`}
			name="stack"
			class="admin-input"
			value={project?.stack.join(', ') ?? ''}
			placeholder="SvelteKit, TypeScript, Supabase"
			required
		/>
	</label>
	<label class="admin-field wide">
		<span class="admin-label">Description</span>
		<textarea
			id={`${prefix}-description`}
			name="description"
			class="admin-textarea"
			rows="4"
			required>{project?.description ?? ''}</textarea
		>
	</label>
</div>

<div class="visibility-row">
	<label
		><input
			class="admin-checkbox"
			type="checkbox"
			name="is_published"
			checked={project?.is_published ?? true}
		/> Published on website</label
	>
	<label
		><input
			class="admin-checkbox"
			type="checkbox"
			name="featured"
			checked={project?.featured ?? false}
		/> Feature on homepage</label
	>
</div>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 17px 14px;
	}
	.wide {
		grid-column: 1 / -1;
	}
	.visibility-row {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		margin-top: 20px;
	}
	.visibility-row label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--admin-muted);
	}
	@media (max-width: 600px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
		.wide {
			grid-column: auto;
		}
	}
</style>
