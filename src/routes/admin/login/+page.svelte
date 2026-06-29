<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowRight, CheckCircle2, KeyRound, Mail } from 'lucide-svelte';
	import Logo from '$lib/components/Logo.svelte';

	let { form } = $props();
	let loginMode = $state<'magic' | 'password'>('magic');
	let isLoading = $state(false);

	function loadingEnhance() {
		isLoading = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			await update();
			isLoading = false;
		};
	}
</script>

<svelte:head>
	<title>Admin Login | Luna Labs</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="login-page">
	<div class="login-brand">
		<Logo variant="wordmark" class="h-8 w-auto" />
		<div>
			<p class="admin-eyebrow">Restricted workspace</p>
			<h1>Studio operations</h1>
			<p>Manage inquiries and published work from one focused workspace.</p>
		</div>
		<span class="admin-meta">Luna Labs / Admin</span>
	</div>

	<section class="login-panel admin-panel">
		{#if form?.magicLinkSent}
			<div class="success-state">
				<CheckCircle2 size={28} strokeWidth={1.3} />
				<p class="admin-eyebrow">Link dispatched</p>
				<h2>Check your inbox.</h2>
				<p>
					A secure login link was sent to <strong>{form.email}</strong>. It expires in one hour.
				</p>
				<button class="admin-button" onclick={() => window.location.reload()}
					>Try another email</button
				>
			</div>
		{:else}
			<header>
				<p class="admin-eyebrow">Authentication</p>
				<h2>Sign in</h2>
				<p>Use an approved Luna Labs administrator account.</p>
			</header>

			<div class="mode-switch" aria-label="Sign in method">
				<button class:active={loginMode === 'magic'} onclick={() => (loginMode = 'magic')}
					><Mail size={14} /> Magic link</button
				>
				<button class:active={loginMode === 'password'} onclick={() => (loginMode = 'password')}
					><KeyRound size={14} /> Password</button
				>
			</div>

			{#if form?.error}<div class="admin-notice" data-tone="error" role="alert">
					{form.error}
				</div>{/if}

			{#if loginMode === 'magic'}
				<form method="POST" action="?/magiclink" use:enhance={loadingEnhance}>
					<label class="admin-field"
						><span class="admin-label">Email address</span><input
							class="admin-input"
							id="magic-email"
							name="email"
							type="email"
							autocomplete="email"
							placeholder="name@lunalabs.site"
							required
						/></label
					>
					<button class="admin-button-primary" type="submit" disabled={isLoading}
						>{isLoading ? 'Sending link...' : 'Send magic link'} <ArrowRight size={14} /></button
					>
				</form>
			{:else}
				<form method="POST" action="?/password" use:enhance={loadingEnhance}>
					<label class="admin-field"
						><span class="admin-label">Email address</span><input
							class="admin-input"
							id="password-email"
							name="email"
							type="email"
							autocomplete="email"
							placeholder="name@lunalabs.site"
							required
						/></label
					>
					<label class="admin-field"
						><span class="admin-label">Password</span><input
							class="admin-input"
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							placeholder="Your password"
							required
						/></label
					>
					<button class="admin-button-primary" type="submit" disabled={isLoading}
						>{isLoading ? 'Signing in...' : 'Sign in'} <ArrowRight size={14} /></button
					>
				</form>
			{/if}
		{/if}
	</section>
</main>

<style>
	.login-page {
		display: grid;
		min-height: 100vh;
		grid-template-columns: minmax(280px, 0.9fr) minmax(380px, 1.1fr);
	}
	.login-brand {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid var(--admin-line);
		padding: 48px;
		background: #0e0e10;
	}
	.login-brand > div {
		max-width: 520px;
	}
	.login-brand h1 {
		margin-top: 15px;
		font-family: 'Barlow', sans-serif;
		font-size: clamp(3rem, 6vw, 6.5rem);
		font-weight: 550;
		line-height: 0.9;
		text-transform: uppercase;
	}
	.login-brand > div > p:last-child {
		max-width: 420px;
		margin-top: 22px;
		color: var(--admin-muted);
		font-size: 14px;
		line-height: 1.8;
	}
	.login-brand > .admin-meta {
		color: var(--admin-faint);
	}
	.login-panel {
		align-self: center;
		width: min(calc(100% - 48px), 470px);
		margin: 40px auto;
		padding: 30px;
	}
	.login-panel header {
		margin-bottom: 24px;
	}
	.login-panel h2 {
		margin-top: 8px;
		font-family: 'Barlow', sans-serif;
		font-size: 32px;
		font-weight: 500;
	}
	.login-panel header > p:last-child,
	.success-state > p:not(.admin-eyebrow) {
		margin-top: 9px;
		color: var(--admin-muted);
		font-size: 13px;
		line-height: 1.7;
	}
	.mode-switch {
		display: grid;
		grid-template-columns: 1fr 1fr;
		margin-bottom: 18px;
		border: 1px solid var(--admin-line);
		border-radius: 4px;
		padding: 3px;
	}
	.mode-switch button {
		display: flex;
		min-height: 39px;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border-radius: 3px;
		color: var(--admin-muted);
		font-size: 11px;
	}
	.mode-switch button.active {
		background: #f4f4f5;
		color: #111113;
	}
	.login-panel form {
		display: grid;
		gap: 17px;
	}
	.login-panel form .admin-button-primary {
		width: 100%;
		margin-top: 3px;
	}
	.login-panel .admin-notice {
		margin-bottom: 17px;
	}
	.success-state {
		display: grid;
		justify-items: start;
		gap: 12px;
		padding: 8px;
	}
	.success-state :global(svg) {
		color: var(--admin-positive);
	}
	.success-state h2 {
		margin: 0;
	}
	.success-state strong {
		color: #e4e4e7;
	}
	.success-state .admin-button {
		margin-top: 8px;
	}
	@media (max-width: 800px) {
		.login-page {
			display: block;
			padding: 26px 18px;
		}
		.login-brand {
			display: block;
			border: 0;
			padding: 18px 4px 30px;
			background: transparent;
		}
		.login-brand > div,
		.login-brand > .admin-meta {
			display: none;
		}
		.login-panel {
			width: min(100%, 470px);
			margin: 20px auto;
			padding: 24px;
		}
	}
</style>
