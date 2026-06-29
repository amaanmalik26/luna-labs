<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- project URLs are admin-controlled external links */
	import { ExternalLink } from 'lucide-svelte';
	import {
		projectCanEmbed,
		projectHost,
		projectStatusLabel,
		type PortfolioProject
	} from '$lib/portfolio';

	let {
		project,
		compact = false
	}: {
		project: PortfolioProject;
		compact?: boolean;
	} = $props();

	const canEmbed = $derived(projectCanEmbed(project));
	const host = $derived(projectHost(project.website_url));
</script>

<div class:compact class="project-browser">
	<div class="browser-bar">
		<div class="browser-dots" aria-hidden="true"><span></span><span></span><span></span></div>
		<p>{host}</p>
		<span class="browser-status"
			>{canEmbed ? 'Live preview' : projectStatusLabel(project.status)}</span
		>
	</div>

	<div class="browser-stage">
		{#if canEmbed && project.website_url}
			<iframe
				src={project.website_url}
				title={`${project.title} website preview`}
				loading="lazy"
				referrerpolicy="strict-origin-when-cross-origin"
				sandbox="allow-scripts allow-same-origin"
			></iframe>
		{:else}
			<div class="project-fallback">
				<div class="fallback-grid" aria-hidden="true"></div>
				<div class="fallback-content">
					{#if project.logo_url}
						<img src={project.logo_url} alt="" />
					{:else}
						<span class="fallback-index">{project.year}</span>
					{/if}
					<p>{project.category}</p>
					<h3>{project.title}</h3>
					<div class="fallback-stack">
						{#each project.stack.slice(0, compact ? 2 : 4) as technology (technology)}
							<span>{technology}</span>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if project.website_url}
		<a
			href={project.website_url}
			target="_blank"
			rel="noreferrer"
			class="browser-open"
			aria-label={`Open ${project.title} website`}
		>
			<ExternalLink size={14} strokeWidth={1.5} />
		</a>
	{/if}
</div>

<style>
	.project-browser {
		position: relative;
		overflow: hidden;
		border: 1px solid rgb(63 63 70 / 0.72);
		background: #111113;
		box-shadow: 0 30px 80px rgb(0 0 0 / 0.32);
	}

	.browser-bar {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
		min-height: 48px;
		padding: 0 16px;
		border-bottom: 1px solid rgb(63 63 70 / 0.55);
		background: #17171a;
	}

	.browser-dots {
		display: flex;
		gap: 6px;
	}

	.browser-dots span {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: rgb(244 244 245 / 0.28);
	}

	.browser-bar p,
	.browser-status {
		overflow: hidden;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.14em;
		color: rgb(161 161 170 / 0.72);
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.browser-bar p {
		text-align: center;
	}

	.browser-stage {
		height: clamp(380px, 48vw, 620px);
		background: #0d0d0e;
	}

	.compact .browser-stage {
		height: clamp(260px, 34vw, 410px);
	}

	.browser-stage iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		background: #fff;
	}

	.project-fallback {
		position: relative;
		display: grid;
		height: 100%;
		place-items: center;
		overflow: hidden;
		background: linear-gradient(145deg, #18181b, #0b0b0c);
	}

	.fallback-grid {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgb(244 244 245 / 0.045) 1px, transparent 1px),
			linear-gradient(rgb(244 244 245 / 0.035) 1px, transparent 1px);
		background-size: 34px 34px;
		mask-image: linear-gradient(to bottom, black, transparent 88%);
	}

	.fallback-content {
		position: relative;
		z-index: 1;
		display: grid;
		max-width: 620px;
		justify-items: center;
		padding: 40px;
		text-align: center;
	}

	.fallback-content img {
		max-width: 180px;
		max-height: 72px;
		margin-bottom: 28px;
		object-fit: contain;
	}

	.fallback-index,
	.fallback-content p,
	.fallback-stack span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.fallback-index {
		margin-bottom: 28px;
		color: rgb(244 244 245 / 0.3);
	}

	.fallback-content p {
		margin-bottom: 18px;
		color: rgb(161 161 170 / 0.72);
	}

	.fallback-content h3 {
		font-family: 'Barlow', sans-serif;
		font-size: clamp(2.3rem, 6vw, 5.6rem);
		font-weight: 650;
		line-height: 0.92;
		color: #f4f4f5;
		text-transform: uppercase;
	}

	.fallback-stack {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px 18px;
		margin-top: 30px;
	}

	.fallback-stack span {
		color: rgb(113 113 122);
	}

	.browser-open {
		position: absolute;
		right: 14px;
		bottom: 14px;
		display: grid;
		width: 40px;
		height: 40px;
		place-items: center;
		border: 1px solid rgb(244 244 245 / 0.18);
		background: rgb(13 13 14 / 0.88);
		color: rgb(244 244 245 / 0.72);
		transition:
			color 180ms ease,
			border-color 180ms ease;
	}

	.browser-open:hover {
		border-color: rgb(244 244 245 / 0.5);
		color: #fff;
	}

	@media (max-width: 640px) {
		.browser-status {
			display: none;
		}

		.browser-bar {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.browser-stage,
		.compact .browser-stage {
			height: 320px;
		}
	}
</style>
