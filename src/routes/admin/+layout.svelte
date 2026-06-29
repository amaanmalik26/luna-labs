<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import {
		Activity,
		ExternalLink,
		FolderKanban,
		LayoutDashboard,
		LogOut,
		Menu,
		UsersRound,
		X
	} from 'lucide-svelte';
	import Logo from '$lib/components/Logo.svelte';
	import '$lib/styles/admin.css';

	let { children, data } = $props();
	let sidebarOpen = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
		{ href: '/admin/leads', label: 'Leads', icon: UsersRound, exact: false },
		{ href: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban, exact: false }
	] as const;

	const isLoginPage = $derived($page.url.pathname === '/admin/login');

	function isActive(href: string, exact: boolean) {
		return exact ? $page.url.pathname === href : $page.url.pathname.startsWith(href);
	}

	async function signOut() {
		await fetch(resolve('/admin/signout'), { method: 'POST' });
		window.location.href = resolve('/admin/login');
	}
</script>

{#if isLoginPage}
	<div class="admin-login">{@render children()}</div>
{:else}
	<div class="admin-shell">
		<aside class:open={sidebarOpen} class="admin-sidebar" aria-label="Admin navigation">
			<div class="sidebar-brand">
				<a href={resolve('/admin')} aria-label="Luna Labs admin dashboard">
					<Logo variant="wordmark" class="h-6 w-auto" />
				</a>
				<button class="sidebar-close" onclick={() => (sidebarOpen = false)} aria-label="Close menu">
					<X size={18} />
				</button>
			</div>

			<div class="sidebar-context">
				<span class="admin-eyebrow">Operations</span>
				<p>Studio control room</p>
			</div>

			<nav class="sidebar-nav">
				{#each navItems as item (item.href)}
					{@const NavIcon = item.icon}
					<a
						href={resolve(item.href)}
						class:active={isActive(item.href, item.exact)}
						onclick={() => (sidebarOpen = false)}
						aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
					>
						<NavIcon size={17} strokeWidth={1.5} />
						<span>{item.label}</span>
						<span class="nav-index">0{navItems.indexOf(item) + 1}</span>
					</a>
				{/each}
			</nav>

			<div class="sidebar-footer">
				<a href={resolve('/')} target="_blank" rel="noreferrer">
					<ExternalLink size={15} /> View website
				</a>
				<button onclick={signOut}><LogOut size={15} /> Sign out</button>
				{#if data.session?.user?.email}
					<p title={data.session.user.email}>{data.session.user.email}</p>
				{/if}
			</div>
		</aside>

		{#if sidebarOpen}
			<button
				class="sidebar-overlay"
				onclick={() => (sidebarOpen = false)}
				aria-label="Close navigation"
			></button>
		{/if}

		<div class="admin-main">
			<header class="admin-topbar">
				<button onclick={() => (sidebarOpen = true)} class="menu-button" aria-label="Open menu">
					<Menu size={19} />
				</button>
				<div class="system-state"><Activity size={14} /> Systems operational</div>
				<span class="admin-meta">Luna Labs / Admin</span>
			</header>
			<main class="admin-content">{@render children()}</main>
		</div>
	</div>
{/if}

<style>
	.admin-shell {
		display: flex;
	}

	.admin-sidebar {
		position: fixed;
		inset: 0 auto 0 0;
		z-index: 60;
		display: flex;
		width: 244px;
		flex-direction: column;
		border-right: 1px solid var(--admin-line);
		background: #0e0e10;
		transform: translateX(-100%);
		transition: transform 200ms ease;
	}

	.admin-sidebar.open {
		transform: translateX(0);
	}

	.sidebar-brand {
		display: flex;
		height: 76px;
		align-items: center;
		justify-content: space-between;
		padding: 0 22px;
	}

	.sidebar-close,
	.menu-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--admin-muted);
	}

	.sidebar-context {
		margin: 4px 14px 28px;
		border: 1px solid var(--admin-line);
		border-radius: 4px;
		padding: 15px;
	}

	.sidebar-context p {
		margin-top: 6px;
		font-family: 'Barlow', sans-serif;
		font-size: 15px;
		color: #d4d4d8;
	}

	.sidebar-nav {
		display: grid;
		gap: 3px;
		padding: 0 10px;
	}

	.sidebar-nav a {
		display: grid;
		grid-template-columns: 22px 1fr auto;
		align-items: center;
		gap: 10px;
		border-radius: 4px;
		padding: 11px 12px;
		font-size: 13px;
		color: var(--admin-muted);
		transition:
			background 150ms ease,
			color 150ms ease;
	}

	.sidebar-nav a:hover {
		background: #171719;
		color: #e4e4e7;
	}

	.sidebar-nav a.active {
		background: #f4f4f5;
		color: #111113;
	}

	.nav-index {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		color: currentColor;
		opacity: 0.55;
	}

	.sidebar-footer {
		display: grid;
		gap: 4px;
		margin-top: auto;
		border-top: 1px solid var(--admin-line);
		padding: 17px 14px;
	}

	.sidebar-footer a,
	.sidebar-footer button {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px;
		font-size: 12px;
		color: var(--admin-muted);
	}

	.sidebar-footer a:hover,
	.sidebar-footer button:hover {
		color: white;
	}

	.sidebar-footer p {
		overflow: hidden;
		margin: 8px 8px 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		color: var(--admin-faint);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgb(0 0 0 / 0.68);
	}

	.admin-main {
		min-width: 0;
		width: 100%;
	}

	.admin-topbar {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		height: 58px;
		align-items: center;
		gap: 18px;
		border-bottom: 1px solid var(--admin-line);
		background: rgb(11 11 12 / 0.94);
		padding: 0 20px;
		backdrop-filter: blur(12px);
	}

	.system-state {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: var(--admin-positive);
	}

	.admin-topbar .admin-meta {
		margin-left: auto;
		color: var(--admin-faint);
	}

	.admin-content {
		padding: 30px 20px 60px;
	}

	@media (min-width: 1024px) {
		.admin-sidebar {
			position: sticky;
			top: 0;
			flex: 0 0 244px;
			transform: none;
		}
		.sidebar-close,
		.menu-button {
			display: none;
		}
		.admin-content {
			padding: 42px 42px 72px;
		}
	}
</style>
