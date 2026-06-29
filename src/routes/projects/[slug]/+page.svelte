<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- hashes are appended to resolved routes */
	import { resolve } from '$app/paths';
	import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-svelte';
	import ProjectBrowser from '$lib/components/ProjectBrowser.svelte';
	import { projectSlug, projectStatusLabel } from '$lib/portfolio';
	import { siteDetails } from '$lib/data/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
</script>

<svelte:head>
	<title>{project.title} | Luna Labs Projects</title>
	<meta name="description" content={project.description} />
	<link rel="canonical" href={`${siteDetails.url}/projects/${projectSlug(project)}`} />
</svelte:head>

<article class="px-6 pt-32 pb-24 sm:px-10 md:px-16 md:pt-40">
	<header class="mx-auto max-w-6xl">
		<a href={resolve('/projects')} class="back-link">
			<ArrowLeft size={14} strokeWidth={1.5} /> All projects
		</a>

		<div
			class="mt-16 grid gap-12 border-b border-zinc-800/70 pb-20 lg:grid-cols-[1fr_auto] lg:items-end"
		>
			<div>
				<p class="section-label mb-7">{project.category}</p>
				<h1>{project.title}</h1>
			</div>
			<div class="project-meta">
				<div><span>Status</span><strong>{projectStatusLabel(project.status)}</strong></div>
				<div><span>Year</span><strong>{project.year}</strong></div>
				<div><span>Scope</span><strong>{project.stack.length} systems</strong></div>
			</div>
		</div>
	</header>

	<section class="mx-auto max-w-6xl py-16 md:py-24">
		<ProjectBrowser {project} />
	</section>

	<section
		class="mx-auto grid max-w-6xl gap-14 border-t border-zinc-800/70 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr]"
	>
		<div>
			<p class="section-label mb-6">Project overview</p>
			<h2>Structure before decoration.</h2>
		</div>
		<div>
			<p class="text-lg leading-9 text-zinc-400">{project.description}</p>
			<div class="mt-12 grid gap-px border border-zinc-800/70 bg-zinc-800/70 sm:grid-cols-3">
				<div class="detail-cell"><span>Project type</span><strong>{project.category}</strong></div>
				<div class="detail-cell">
					<span>Delivery</span><strong>{projectStatusLabel(project.status)}</strong>
				</div>
				<div class="detail-cell">
					<span>Platform</span><strong>{project.stack[0] ?? 'Custom web'}</strong>
				</div>
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl border-t border-zinc-800/70 py-20 md:py-28">
		<div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
			<div>
				<p class="section-label mb-6">Technology</p>
				<h2>The working parts.</h2>
			</div>
			<div class="stack-grid">
				{#each project.stack as technology, index (technology)}
					<div><span>{String(index + 1).padStart(2, '0')}</span><strong>{technology}</strong></div>
				{/each}
			</div>
		</div>

		{#if project.website_url}
			<a href={project.website_url} target="_blank" rel="noreferrer" class="live-link">
				Visit live project <ExternalLink size={15} strokeWidth={1.5} />
			</a>
		{/if}
	</section>

	<footer class="mx-auto max-w-6xl border-t border-zinc-800/70 pt-20 md:pt-28">
		<p class="section-label mb-7">Next project</p>
		<div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
			<a
				href={resolve('/projects/[slug]', { slug: projectSlug(data.nextProject) })}
				class="next-link"
			>
				{data.nextProject.title}
			</a>
			<a href={`${resolve('/')}#contact`} class="contact-link">
				Start a project <ArrowRight size={14} strokeWidth={1.5} />
			</a>
		</div>
	</footer>
</article>

<style>
	.section-label,
	.back-link,
	.project-meta span,
	.detail-cell span,
	.stack-grid span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
	}

	.section-label {
		color: rgb(113 113 122);
	}
	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		color: rgb(113 113 122);
		transition: color 180ms ease;
	}
	.back-link:hover {
		color: #f4f4f5;
	}

	h1 {
		max-width: 900px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(3.7rem, 9vw, 8.5rem);
		font-weight: 650;
		line-height: 0.88;
		color: #f4f4f5;
		text-transform: uppercase;
	}

	h2 {
		max-width: 540px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(2.2rem, 4.8vw, 4.6rem);
		font-weight: 600;
		line-height: 0.98;
		color: #f4f4f5;
		text-transform: uppercase;
	}

	.project-meta {
		display: grid;
		min-width: 260px;
		border-top: 1px solid rgb(63 63 70 / 0.7);
	}
	.project-meta div {
		display: flex;
		justify-content: space-between;
		gap: 24px;
		padding: 12px 0;
		border-bottom: 1px solid rgb(63 63 70 / 0.7);
	}
	.project-meta span {
		color: rgb(82 82 91);
	}
	.project-meta strong {
		font-size: 13px;
		font-weight: 500;
		color: rgb(212 212 216);
	}

	.detail-cell {
		display: grid;
		gap: 14px;
		min-height: 132px;
		align-content: end;
		padding: 22px;
		background: #111113;
	}
	.detail-cell span {
		color: rgb(82 82 91);
	}
	.detail-cell strong {
		font-size: 14px;
		font-weight: 500;
		color: rgb(212 212 216);
	}

	.stack-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		border-top: 1px solid rgb(63 63 70 / 0.7);
	}
	.stack-grid div {
		display: grid;
		gap: 22px;
		min-height: 150px;
		align-content: end;
		padding: 24px 0;
		border-bottom: 1px solid rgb(63 63 70 / 0.7);
	}
	.stack-grid div:nth-child(odd) {
		padding-right: 24px;
		border-right: 1px solid rgb(63 63 70 / 0.7);
	}
	.stack-grid div:nth-child(even) {
		padding-left: 24px;
	}
	.stack-grid span {
		color: rgb(82 82 91);
	}
	.stack-grid strong {
		font-family: 'Barlow', sans-serif;
		font-size: 24px;
		font-weight: 500;
		color: #f4f4f5;
	}

	.live-link,
	.contact-link {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		font-family: 'Barlow', sans-serif;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
	}
	.live-link {
		margin-top: 48px;
		border-bottom: 1px solid rgb(113 113 122);
		padding-bottom: 8px;
		color: rgb(161 161 170);
	}
	.live-link:hover {
		color: #fff;
	}
	.contact-link {
		background: #f4f4f5;
		padding: 14px 18px;
		color: #111113;
	}

	.next-link {
		max-width: 760px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(2.8rem, 7vw, 6.5rem);
		font-weight: 600;
		line-height: 0.95;
		color: #f4f4f5;
		text-transform: uppercase;
		transition: color 180ms ease;
	}
	.next-link:hover {
		color: rgb(161 161 170);
	}

	@media (max-width: 640px) {
		.stack-grid {
			grid-template-columns: 1fr;
		}
		.stack-grid div:nth-child(odd),
		.stack-grid div:nth-child(even) {
			padding-right: 0;
			padding-left: 0;
			border-right: 0;
		}
	}
</style>
