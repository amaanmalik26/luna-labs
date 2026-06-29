<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- hashes are appended to resolved routes */
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/actions/reveal';
	import { siteDetails } from '$lib/data/site';
	import Logo from './Logo.svelte';

	const year = new Date().getFullYear();
	const links = [
		{ route: '/services', hash: '', label: 'Services' },
		{ route: '/projects', hash: '', label: 'Projects' },
		{ route: '/', hash: '#process', label: 'Process' },
		{ route: '/', hash: '#contact', label: 'Contact' }
	] as const;
</script>

<footer class="border-t border-zinc-800/50 px-12 py-16 md:px-20">
	<div class="mx-auto max-w-5xl">
		<div class="flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
			<div use:reveal={{ y: 12, duration: 0.7 }}>
				<a
					href={resolve('/')}
					aria-label="Luna Labs home"
					class="inline-flex transition-opacity hover:opacity-70"
				>
					<Logo class="h-8 w-auto sm:h-9" />
				</a>
				<p class="mt-4 max-w-sm text-xs leading-relaxed text-zinc-700">
					{siteDetails.description}
				</p>
				<div class="mt-5 space-y-1 text-xs text-zinc-700">
					<a
						class="block transition-colors hover:text-zinc-300"
						href={`mailto:${siteDetails.email}`}
					>
						{siteDetails.email}
					</a>
					<p>{siteDetails.location}</p>
				</div>
			</div>

			<nav
				use:reveal={{ y: 12, duration: 0.7, delay: 0.08 }}
				class="flex flex-wrap gap-x-8 gap-y-4 md:justify-end"
				aria-label="Footer navigation"
			>
				{#each links as item (item.label)}
					<a
						href={`${resolve(item.route)}${item.hash}`}
						class="text-[10px] tracking-widest text-zinc-600 uppercase transition-colors hover:text-zinc-300"
						style:font-family="'Barlow', sans-serif"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>

		<div
			class="mt-16 flex flex-col items-center justify-between gap-3 border-t border-zinc-800/40 pt-8 md:flex-row"
		>
			<p
				class="text-[10px] tracking-widest text-zinc-800"
				style:font-family="'JetBrains Mono', monospace"
			>
				&copy; {year}
				{siteDetails.name}. All rights reserved.
			</p>
			<p
				class="text-[10px] tracking-widest text-zinc-800"
				style:font-family="'JetBrains Mono', monospace"
			>
				{siteDetails.tagline}
			</p>
		</div>
	</div>
</footer>
