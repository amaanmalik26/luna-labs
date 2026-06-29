<script lang="ts">
	import { resolve } from '$app/paths';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, ShoppingBag } from 'lucide-svelte';
	import { reveal } from '$lib/actions/reveal';
	import {
		defaultPortfolioProjects,
		projectCanEmbed,
		projectHost,
		projectSlug,
		type PortfolioProject
	} from '$lib/portfolio';

	type Build = {
		id: string;
		name: string;
		type: string;
		description: string;
		url: string | null;
		displayUrl: string;
		tag: string;
		action: string;
		canFrame: boolean;
		fallbackTitle: string;
		fallbackDescription: string;
		accent: string;
		stack: string[];
		slug: string;
	};

	let { projects = defaultPortfolioProjects }: { projects?: PortfolioProject[] } = $props();

	function toBuild(project: PortfolioProject): Build {
		const host = projectHost(project.website_url);
		return {
			id: project.id,
			name: project.title,
			type: project.category,
			description: project.description,
			url: project.website_url,
			displayUrl: host,
			tag: project.status.replace('-', ' '),
			action: project.website_url ? 'Open Website' : 'Preview Unavailable',
			canFrame: projectCanEmbed(project),
			fallbackTitle: project.title,
			fallbackDescription: project.description,
			accent: '#e3e3dc',
			stack: project.stack,
			slug: projectSlug(project)
		};
	}

	const fallbackBuild = toBuild(defaultPortfolioProjects[0] as PortfolioProject);
	const builds = $derived((projects.length ? projects : defaultPortfolioProjects).map(toBuild));

	let activeIndex = $state(0);
	let slideDirection = $state<1 | -1>(1);
	let previewKey = $state(0);
	const active = $derived(builds[activeIndex] ?? fallbackBuild);

	$effect(() => {
		if (activeIndex >= builds.length) activeIndex = 0;
	});

	function selectBuild(index: number) {
		if (index === activeIndex) return;
		slideDirection = index > activeIndex ? 1 : -1;
		activeIndex = index;
		previewKey += 1;
	}

	function moveBuild(direction: -1 | 1) {
		if (builds.length === 0) return;
		slideDirection = direction;
		activeIndex = (activeIndex + direction + builds.length) % builds.length;
		previewKey += 1;
	}

	function openActiveBuild() {
		if (!active.url) return;
		window.open(active.url, '_blank', 'noopener,noreferrer');
	}
</script>

<section id="portfolio" class="customer-section relative px-12 py-32 md:px-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-16 flex items-baseline justify-between">
			<p
				use:reveal={{ duration: 0.7 }}
				class="text-[10px] tracking-[0.45em] text-zinc-600 uppercase"
				style:font-family="'Barlow', sans-serif"
			>
				Our Valuable Customers
			</p>
			<span
				use:reveal={{ duration: 0.7, delay: 0.1 }}
				class="text-[10px] tracking-widest text-zinc-700"
				style:font-family="'JetBrains Mono', monospace"
			>
				{builds.length} selected builds
			</span>
		</div>

		<div class="customer-showcase grid items-center gap-14 md:grid-cols-[0.82fr_1.18fr]">
			<div use:reveal={{ y: 20, duration: 0.7 }} class="min-w-0">
				<div class="mb-12 flex flex-wrap gap-x-8 gap-y-4">
					{#each builds as build, i (build.id)}
						<button
							type="button"
							class="customer-tab"
							class:active={i === activeIndex}
							onclick={() => selectBuild(i)}
						>
							{build.type}
						</button>
					{/each}
				</div>

				<div class="copy-stage">
					{#key `copy-${previewKey}`}
						<div
							in:fly={{ x: slideDirection * 34, duration: 420, easing: cubicOut }}
							class="customer-copy"
						>
							<p
								class="mb-5 text-[10px] tracking-[0.38em] text-zinc-600 uppercase"
								style:font-family="'Barlow', sans-serif"
							>
								{active.tag}
							</p>

							<h2
								class="mb-7 max-w-xl text-4xl leading-[1.02] text-zinc-100 uppercase md:text-6xl"
								style:font-family="'Barlow', sans-serif"
								style:font-weight="650"
							>
								{active.name}
							</h2>

							<p class="max-w-xl text-base leading-8 text-zinc-500">
								{active.description}
							</p>
						</div>
					{/key}
				</div>

				<div class="mt-12 flex flex-wrap items-center gap-5">
					<a
						href={resolve('/projects/[slug]', { slug: active.slug })}
						class="group inline-flex items-center gap-4 bg-zinc-100 px-6 py-4 text-[11px] font-semibold tracking-[0.2em] text-zinc-950 uppercase transition-colors hover:bg-white"
						style:font-family="'Barlow', sans-serif"
					>
						View project
						<ArrowRight
							size={14}
							strokeWidth={1.5}
							class="transition-transform duration-300 group-hover:translate-x-1"
						/>
					</a>

					{#if active.url}
						<button type="button" onclick={openActiveBuild} class="live-site-link">
							Live site <ExternalLink size={13} strokeWidth={1.5} />
						</button>
					{/if}

					<div class="flex gap-3">
						<button
							type="button"
							class="build-arrow"
							aria-label="Previous build"
							onclick={() => moveBuild(-1)}
						>
							<ChevronLeft size={17} strokeWidth={1.4} />
						</button>
						<button
							type="button"
							class="build-arrow"
							aria-label="Next build"
							onclick={() => moveBuild(1)}
						>
							<ChevronRight size={17} strokeWidth={1.4} />
						</button>
					</div>
				</div>
			</div>

			<div use:reveal={{ y: 24, duration: 0.75, delay: 0.12 }} class="build-browser-wrap">
				<div class="build-browser">
					<div class="browser-top">
						<div class="flex gap-1.5">
							<span></span>
							<span></span>
							<span></span>
						</div>
						<p>{active.displayUrl}</p>
						<div class="browser-live">
							<span></span>
							{active.canFrame ? 'Live Preview' : 'Frame Blocked'}
						</div>
					</div>

					<div class="preview-stage">
						{#key `preview-${previewKey}`}
							<div
								in:fly={{ x: slideDirection * 76, duration: 500, easing: cubicOut }}
								class="preview-swipe"
							>
								{#if active.canFrame && active.url}
									<iframe
										src={active.url}
										title={`${active.name} live website preview`}
										loading="lazy"
										referrerpolicy="strict-origin-when-cross-origin"
										sandbox="allow-scripts allow-same-origin"
									></iframe>
								{:else}
									<div class="fallback-preview" style:--accent={active.accent}>
										<header>
											<strong>{active.name}</strong>
											<nav>
												{#each active.stack.slice(0, 3) as technology (technology)}
													<span>{technology}</span>
												{/each}
											</nav>
										</header>

										<section>
											<p>{active.tag}</p>
											<h3>{active.fallbackTitle}</h3>
											<span>{active.fallbackDescription}</span>
										</section>

										<div class="fallback-menu">
											<div>
												<span></span>
												<strong>Interface</strong>
												<p>{active.type}</p>
											</div>
											<div>
												<span></span>
												<strong>Delivery</strong>
												<p>{active.tag}</p>
											</div>
										</div>
									</div>
								{/if}
							</div>
						{/key}
					</div>
				</div>

				<div class="preview-caption">
					<div>
						<ShoppingBag size={18} strokeWidth={1.5} />
					</div>
					<p>
						<span>{active.type}</span>
						{active.stack.slice(0, 2).join(' / ') || active.tag}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.customer-section::before {
		position: absolute;
		inset: 12% 0 auto 42%;
		width: 44vw;
		height: 44vw;
		pointer-events: none;
		content: '';
		background: radial-gradient(circle, rgb(244 244 245 / 0.08), transparent 60%);
		filter: blur(14px);
	}

	.customer-tab {
		padding: 0 0 10px;
		border-bottom: 1px solid transparent;
		font-family: 'Barlow', sans-serif;
		font-size: 11px;
		font-weight: 400;
		letter-spacing: 0.18em;
		color: rgb(113 113 122);
		text-transform: uppercase;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}

	.customer-tab.active,
	.customer-tab:hover {
		border-color: rgb(244 244 245 / 0.76);
		color: rgb(244 244 245);
	}

	.copy-stage {
		min-height: 260px;
		overflow: hidden;
	}

	.build-arrow {
		display: flex;
		width: 46px;
		height: 46px;
		align-items: center;
		justify-content: center;
		border: 1px solid rgb(63 63 70 / 0.8);
		color: rgb(161 161 170);
		transition:
			border-color 0.25s ease,
			color 0.25s ease,
			transform 0.25s ease;
	}

	.build-arrow:hover {
		border-color: rgb(244 244 245 / 0.72);
		color: rgb(244 244 245);
		transform: translateY(-1px);
	}

	.live-site-link {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border-bottom: 1px solid rgb(113 113 122 / 0.7);
		padding: 8px 0;
		font-family: 'Barlow', sans-serif;
		font-size: 10px;
		letter-spacing: 0.17em;
		color: rgb(161 161 170);
		text-transform: uppercase;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.live-site-link:hover {
		border-color: rgb(244 244 245);
		color: rgb(244 244 245);
	}

	.build-browser-wrap {
		position: relative;
	}

	.build-browser {
		position: relative;
		overflow: hidden;
		border: 1px solid rgb(244 244 245 / 0.13);
		background: #121215;
		box-shadow: 0 34px 100px rgb(0 0 0 / 0.42);
		color: rgb(244 244 245);
	}

	.browser-top {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 18px;
		border-bottom: 1px solid rgb(244 244 245 / 0.08);
		padding: 14px 18px;
	}

	.browser-top span {
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: rgb(244 244 245 / 0.28);
	}

	.browser-top p {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.16em;
		color: rgb(244 244 245 / 0.38);
		text-align: center;
		text-transform: uppercase;
	}

	.browser-live {
		display: flex;
		align-items: center;
		gap: 7px;
		border: 1px solid rgb(244 244 245 / 0.1);
		padding: 7px 10px;
		font-family: 'Barlow', sans-serif;
		font-size: 10px;
		color: rgb(244 244 245 / 0.56);
	}

	.browser-live span {
		width: 6px;
		height: 6px;
		background: #20c375;
	}

	.preview-stage {
		position: relative;
		height: clamp(360px, 42vw, 510px);
		overflow: hidden;
		background: #1a1a1f;
	}

	.preview-swipe,
	.preview-swipe iframe {
		width: 100%;
		height: 100%;
	}

	.preview-swipe iframe {
		display: block;
		border: 0;
		background: #fff;
	}

	.fallback-preview {
		display: flex;
		height: 100%;
		flex-direction: column;
		background:
			radial-gradient(circle at 68% 26%, var(--accent), transparent 20%),
			linear-gradient(135deg, #19191d, #0f0f11);
	}

	.fallback-preview header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		padding: 18px 22px;
		background: rgb(0 0 0 / 0.42);
	}

	.fallback-preview strong,
	.fallback-preview h3,
	.fallback-menu strong {
		font-family: 'Barlow', sans-serif;
	}

	.fallback-preview header strong {
		font-size: 14px;
		font-weight: 650;
		letter-spacing: 0.16em;
	}

	.fallback-preview nav {
		display: flex;
		gap: 16px;
		font-family: 'Barlow', sans-serif;
		font-size: 10px;
		color: rgb(244 244 245 / 0.6);
	}

	.fallback-preview section {
		display: grid;
		flex: 1;
		align-content: center;
		padding: 34px;
	}

	.fallback-preview section p {
		margin-bottom: 12px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.22em;
		color: rgb(244 244 245 / 0.55);
		text-transform: uppercase;
	}

	.fallback-preview section h3 {
		max-width: 420px;
		margin-bottom: 18px;
		font-size: clamp(2.3rem, 5vw, 5rem);
		font-weight: 650;
		line-height: 0.96;
		text-transform: uppercase;
	}

	.fallback-preview section span {
		max-width: 430px;
		font-size: 14px;
		line-height: 1.8;
		color: rgb(212 212 216 / 0.72);
	}

	.fallback-menu {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		background: rgb(244 244 245 / 0.08);
	}

	.fallback-menu div {
		display: grid;
		gap: 9px;
		padding: 18px;
		background: #202026;
	}

	.fallback-menu span {
		width: 100%;
		height: 76px;
		background:
			radial-gradient(circle at 50% 42%, rgb(244 244 245 / 0.22), transparent 28%),
			linear-gradient(135deg, rgb(244 244 245 / 0.08), rgb(244 244 245 / 0.02));
	}

	.fallback-menu strong {
		font-size: 16px;
		font-weight: 600;
	}

	.fallback-menu p {
		font-size: 12px;
		color: rgb(161 161 170);
	}

	.preview-caption {
		position: absolute;
		right: -18px;
		bottom: 28px;
		z-index: 4;
		display: flex;
		max-width: 330px;
		align-items: center;
		gap: 14px;
		border: 1px solid rgb(24 24 27 / 0.08);
		background: rgb(255 255 247 / 0.96);
		padding: 15px 18px;
		box-shadow: 0 18px 48px rgb(0 0 0 / 0.22);
		color: #111113;
	}

	.preview-caption div {
		display: flex;
		width: 42px;
		height: 42px;
		flex: 0 0 auto;
		align-items: center;
		justify-content: center;
		background: #111113;
		color: rgb(255 255 247);
	}

	.preview-caption p {
		font-family: 'Barlow', sans-serif;
		font-size: 13px;
		line-height: 1.35;
	}

	.preview-caption span {
		display: block;
		margin-bottom: 4px;
		font-size: 9px;
		letter-spacing: 0.22em;
		color: rgb(24 24 27 / 0.5);
		text-transform: uppercase;
	}

	@media (max-width: 900px) {
		.copy-stage {
			min-height: 220px;
		}

		.browser-top {
			grid-template-columns: auto 1fr;
		}

		.browser-live,
		.fallback-preview nav {
			display: none;
		}

		.preview-caption {
			right: 16px;
			bottom: 16px;
			max-width: calc(100% - 32px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.preview-swipe,
		.customer-copy {
			transition: none !important;
		}
	}
</style>
