<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- live website URLs are admin-controlled external links */
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { ExternalLink, Image, Plus, Save, Trash2 } from 'lucide-svelte';
	import ProjectFields from '$lib/components/admin/ProjectFields.svelte';
	import { projectSlug, projectStatusLabel } from '$lib/portfolio';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const projects = $derived(data.projects);
	let createOpen = $state(false);
</script>

<svelte:head><title>Portfolio | Luna Labs Admin</title></svelte:head>

<div class="admin-page">
	<header class="page-head">
		<div>
			<p class="admin-eyebrow">Content / Public work</p>
			<h1 class="admin-heading">Portfolio</h1>
			<p class="admin-copy">
				Control public project pages, live links, previews, and homepage visibility.
			</p>
		</div>
		<button class="admin-button-primary" onclick={() => (createOpen = !createOpen)}
			><Plus size={15} /> Add project</button
		>
	</header>

	{#if data.loadError}
		<div class="admin-notice">
			<strong>Projects table unavailable.</strong> Run
			<code>src/lib/types/002_create_projects_table.sql</code> in Supabase, then reload.
		</div>
	{/if}
	{#if form?.success}<div class="admin-notice" data-tone="success">
			Portfolio changes saved.
		</div>{/if}
	{#if form?.error}<div class="admin-notice" data-tone="error">{form.error}</div>{/if}

	{#if createOpen}
		<section class="admin-panel create-panel">
			<header>
				<div>
					<p class="admin-label">New project</p>
					<h2>Add to the public portfolio</h2>
				</div>
				<span class="admin-meta">Draft workspace</span>
			</header>
			<form method="POST" action="?/create" use:enhance>
				<ProjectFields prefix="new-project" defaultSort={projects.length * 10 + 10} />
				{#if form?.intent === 'create' && form?.errors}<p class="form-error">
						{Object.values(form.errors)[0]}
					</p>{/if}
				<div class="form-actions">
					<button type="button" class="admin-button" onclick={() => (createOpen = false)}
						>Cancel</button
					><button type="submit" class="admin-button-primary" disabled={data.tableMissing}
						><Plus size={14} /> Create project</button
					>
				</div>
			</form>
		</section>
	{/if}

	<section class="project-list" aria-label="Portfolio projects">
		<div class="list-head">
			<span class="admin-label">Managed projects</span><span class="admin-meta"
				>{projects.length.toString().padStart(2, '0')} total</span
			>
		</div>
		{#each projects as project (project.id)}
			<details class="project-row admin-panel">
				<summary>
					<div class="project-logo">
						{#if project.logo_url}<img src={project.logo_url} alt="" />{:else}<Image
								size={18}
								strokeWidth={1.2}
							/>{/if}
					</div>
					<div class="project-title">
						<h2>{project.title}</h2>
						<p>{project.category} / {project.year}</p>
					</div>
					<span class="admin-status" data-status={project.status}
						>{projectStatusLabel(project.status)}</span
					>
					<span class:published={project.is_published} class="publication"
						>{project.is_published ? 'Published' : 'Hidden'}</span
					>
					<span class="edit-label">Edit</span>
				</summary>

				<div class="editor">
					<div class="project-links">
						<a
							href={resolve('/projects/[slug]', { slug: projectSlug(project) })}
							target="_blank"
							rel="noreferrer">Public detail <ExternalLink size={12} /></a
						>
						{#if project.website_url}<a href={project.website_url} target="_blank" rel="noreferrer"
								>Live website <ExternalLink size={12} /></a
							>{/if}
					</div>
					<form method="POST" action="?/update" use:enhance>
						<input type="hidden" name="id" value={project.id} />
						<ProjectFields prefix={`project-${project.id}`} {project} />
						{#if form?.intent === 'update' && form?.id === project.id && form?.errors}<p
								class="form-error"
							>
								{Object.values(form.errors)[0]}
							</p>{/if}
						<div class="form-actions">
							<button type="submit" class="admin-button-primary" disabled={data.tableMissing}
								><Save size={14} /> Save changes</button
							>
						</div>
					</form>
					<form
						method="POST"
						action="?/delete"
						use:enhance
						class="delete-form"
						onsubmit={(event) => {
							if (!confirm(`Delete ${project.title}?`)) event.preventDefault();
						}}
					>
						<input type="hidden" name="id" value={project.id} />
						<button type="submit" class="admin-button-danger" disabled={data.tableMissing}
							><Trash2 size={14} /> Delete project</button
						>
					</form>
				</div>
			</details>
		{:else}
			<div class="empty-state admin-panel">
				<Image size={22} strokeWidth={1.2} />
				<p>No portfolio projects yet.</p>
				<button class="admin-button" onclick={() => (createOpen = true)}
					>Add the first project</button
				>
			</div>
		{/each}
	</section>
</div>

<style>
	.page-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 30px;
	}
	.page-head h1 {
		margin-top: 10px;
	}
	.page-head .admin-copy {
		margin-top: 10px;
		max-width: 650px;
	}
	.admin-notice {
		margin-bottom: 14px;
	}
	.admin-notice code {
		color: #ededf0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 11px;
	}
	.create-panel {
		margin-bottom: 24px;
	}
	.create-panel > header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 20px;
		border-bottom: 1px solid var(--admin-line);
	}
	.create-panel h2 {
		margin-top: 5px;
		font-family: 'Barlow', sans-serif;
		font-size: 19px;
		font-weight: 500;
	}
	.create-panel form,
	.editor > form:not(.delete-form) {
		padding: 22px 20px;
	}
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 24px;
	}
	.form-error {
		margin-top: 16px;
		color: var(--admin-danger);
		font-size: 12px;
	}
	.list-head {
		display: flex;
		justify-content: space-between;
		padding: 0 3px 10px;
	}
	.project-list {
		display: grid;
		gap: 8px;
	}
	.project-row {
		overflow: hidden;
	}
	.project-row summary {
		display: grid;
		grid-template-columns: 46px minmax(180px, 1fr) 120px 90px 42px;
		align-items: center;
		gap: 16px;
		min-height: 74px;
		padding: 10px 17px;
		cursor: pointer;
		list-style: none;
	}
	.project-row summary::-webkit-details-marker {
		display: none;
	}
	.project-row[open] summary {
		border-bottom: 1px solid var(--admin-line);
		background: #151517;
	}
	.project-logo {
		display: flex;
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--admin-line);
		border-radius: 4px;
		color: var(--admin-faint);
		overflow: hidden;
	}
	.project-logo img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 5px;
	}
	.project-title h2 {
		font-family: 'Barlow', sans-serif;
		font-size: 17px;
		font-weight: 500;
		color: #e4e4e7;
	}
	.project-title p {
		margin-top: 4px;
		font-size: 11px;
		color: var(--admin-faint);
	}
	.publication,
	.edit-label {
		font:
			9px 'JetBrains Mono',
			monospace;
		letter-spacing: 0.1em;
		color: var(--admin-faint);
		text-transform: uppercase;
	}
	.publication.published {
		color: var(--admin-positive);
	}
	.edit-label {
		text-align: right;
	}
	.editor {
		background: #0e0e10;
	}
	.project-links {
		display: flex;
		justify-content: flex-end;
		gap: 18px;
		padding: 13px 20px;
		border-bottom: 1px solid var(--admin-line);
	}
	.project-links a {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 10px;
		color: var(--admin-muted);
	}
	.delete-form {
		display: flex;
		justify-content: flex-end;
		border-top: 1px solid var(--admin-line);
		padding: 16px 20px;
	}
	.empty-state {
		display: grid;
		min-height: 240px;
		place-items: center;
		align-content: center;
		gap: 15px;
		color: var(--admin-muted);
		font-size: 13px;
	}
	@media (max-width: 760px) {
		.page-head {
			align-items: start;
			flex-direction: column;
		}
		.page-head .admin-button-primary {
			width: 100%;
		}
		.project-row summary {
			grid-template-columns: 46px 1fr auto;
		}
		.project-row .admin-status,
		.publication {
			display: none;
		}
	}
</style>
