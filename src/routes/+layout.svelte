<script lang="ts">
	import { dev } from '$app/environment';
	import { page } from '$app/stores';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import Cursor from '$lib/components/Cursor.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import '$lib/styles/site.css';
	import './layout.css';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

{#if isAdminRoute}
	{@render children()}
{:else}
	<div id="top" class="site-shell min-h-screen bg-[#0d0d0e] text-zinc-100 select-none">
		<a
			href="#main-content"
			class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-zinc-100 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950"
		>
			Skip to main content
		</a>
		<Cursor />
		<Navbar />
		<main id="main-content">
			{@render children()}
		</main>
		<Footer />
	</div>
{/if}
