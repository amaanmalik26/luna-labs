<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- hashes are appended to resolved routes */
	import { resolve } from '$app/paths';
	import { ArrowRight, ExternalLink } from 'lucide-svelte';
	import ProjectBrowser from '$lib/components/ProjectBrowser.svelte';
	import { projectSlug, projectStatusLabel } from '$lib/portfolio';
	import { siteDetails } from '$lib/data/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Projects | Luna Labs</title>
	<meta
		name="description"
		content="Selected websites, ordering systems, dashboards, and digital platforms designed and developed by Luna Labs."
	/>
	<link rel="canonical" href={`${siteDetails.url}/projects`} />
</svelte:head>

<div class="px-6 pt-36 pb-24 sm:px-10 md:px-16 md:pt-44">
	<header class="mx-auto max-w-6xl border-b border-zinc-800/70 pb-20 md:pb-28">
		<div class="mb-10 flex items-center justify-between gap-6">
			<p class="section-label">Selected projects</p>
			<p class="mono-label">{data.projects.length} builds</p>
		</div>
		<h1 class="page-title">Work designed to keep working.</h1>
		<p class="mt-8 max-w-2xl text-base leading-8 text-zinc-500 md:text-lg">
			A selection of public websites, ordering experiences, and operational systems shaped around
			real business needs.
		</p>
	</header>

	<main class="mx-auto max-w-6xl">
		{#each data.projects as project, index (project.id)}
			<article class="project-row">
				<div class="project-copy">
					<div class="mb-12 flex items-center justify-between gap-6">
						<span class="mono-label">{String(index + 1).padStart(2, '0')}</span>
						<span class="project-state">{projectStatusLabel(project.status)}</span>
					</div>

					<p class="section-label mb-5">{project.category}</p>
					<h2>{project.title}</h2>
					<p class="mt-7 max-w-lg text-sm leading-7 text-zinc-500 md:text-base">
						{project.description}
					</p>

					<div class="mt-8 flex flex-wrap gap-x-5 gap-y-2">
						{#each project.stack as technology (technology)}
							<span class="stack-label">{technology}</span>
						{/each}
					</div>

					<div class="mt-12 flex flex-wrap items-center gap-6">
						<a
							href={resolve('/projects/[slug]', { slug: projectSlug(project) })}
							class="primary-link"
						>
							View project <ArrowRight size={14} strokeWidth={1.5} />
						</a>
						{#if project.website_url}
							<a href={project.website_url} target="_blank" rel="noreferrer" class="secondary-link">
								Live site <ExternalLink size={13} strokeWidth={1.5} />
							</a>
						{/if}
					</div>
				</div>

				<ProjectBrowser {project} compact />
			</article>
		{/each}
	</main>

	<section class="mx-auto max-w-6xl border-t border-zinc-800/70 pt-20 md:pt-28">
		<p class="section-label mb-7">Start a project</p>
		<div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
			<h2 class="max-w-3xl text-4xl leading-tight font-semibold text-zinc-100 md:text-6xl">
				Have a build that belongs here?
			</h2>
			<a href={`${resolve('/')}#contact`} class="primary-link shrink-0">
				Tell us about it <ArrowRight size={14} strokeWidth={1.5} />
			</a>
		</div>
	</section>
</div>

<style>
	.section-label,
	.mono-label,
	.stack-label,
	.project-state {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.24em;
		text-transform: uppercase;
	}

	.section-label {
		color: rgb(161 161 170);
	}
	.mono-label {
		color: rgb(82 82 91);
	}

	.page-title {
		max-width: 920px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(3.4rem, 8vw, 7.7rem);
		font-weight: 650;
		line-height: 0.91;
		letter-spacing: 0;
		color: #f4f4f5;
		text-transform: uppercase;
	}

	.project-row {
		display: grid;
		align-items: center;
		gap: 64px;
		padding: 112px 0;
		border-bottom: 1px solid rgb(39 39 42 / 0.72);
	}

	.project-copy h2 {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(2.6rem, 5vw, 5.2rem);
		font-weight: 650;
		line-height: 0.95;
		color: #f4f4f5;
		text-transform: uppercase;
	}

	.project-state {
		border: 1px solid rgb(63 63 70 / 0.72);
		padding: 8px 10px;
		color: rgb(161 161 170);
	}

	.stack-label {
		color: rgb(82 82 91);
	}

	.primary-link,
	.secondary-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font-family: 'Barlow', sans-serif;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		transition:
			color 180ms ease,
			background 180ms ease;
	}

	.primary-link {
		background: #f4f4f5;
		padding: 14px 18px;
		color: #111113;
	}

	.primary-link:hover {
		background: #fff;
	}
	.secondary-link {
		color: rgb(113 113 122);
	}
	.secondary-link:hover {
		color: #f4f4f5;
	}

	@media (min-width: 1024px) {
		.project-row {
			grid-template-columns: minmax(0, 0.76fr) minmax(0, 1.24fr);
		}
	}

	@media (max-width: 640px) {
		.project-row {
			gap: 44px;
			padding: 80px 0;
		}
	}
</style>
