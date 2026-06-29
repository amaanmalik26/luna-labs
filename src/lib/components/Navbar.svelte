<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- hashes are appended to resolved routes */
	import { resolve } from '$app/paths';
	import Logo from './Logo.svelte';

	const navigation = [
		{ route: '/services', hash: '', label: 'Services' },
		{ route: '/projects', hash: '', label: 'Projects' },
		{ route: '/', hash: '#contact', label: 'Contact' }
	] as const;
</script>

<nav class="pointer-events-none fixed top-0 right-0 left-0 z-50" aria-label="Primary navigation">
	<div class="flex items-start justify-between px-5 py-6 sm:px-8 sm:py-7">
		<a
			href={resolve('/')}
			aria-label="Luna Labs home"
			class="pointer-events-auto transition-opacity hover:opacity-70"
		>
			<Logo variant="mark" class="h-7 w-auto sm:h-8" />
		</a>

		<div class="pointer-events-auto flex gap-4 sm:gap-10" style:font-family="'Barlow', sans-serif">
			{#each navigation as item (item.label)}
				<a
					href={`${resolve(item.route)}${item.hash}`}
					class="text-[9px] tracking-widest text-zinc-500 uppercase transition-colors hover:text-zinc-100 sm:text-[10px]"
				>
					{item.label}
				</a>
			{/each}
		</div>
	</div>
</nav>
