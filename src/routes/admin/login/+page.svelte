<script lang="ts">
  import { enhance } from '$app/forms';

  let { form } = $props();

  // Toggle between magic link and password login
  let loginMode = $state<'magic' | 'password'>('magic');
  let isLoading = $state(false);
</script>

<svelte:head>
  <title>Admin Login — Luna Labs</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<!--
  Full-screen login — no sidebar layout applies here because the layout
  guard redirects unauthenticated users here before rendering the shell.
  We override with a centered flex layout.
-->
<div class="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-luna-base">

  <!-- Background stars / aura — lightweight version without canvas -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div class="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px]"
         style="background: radial-gradient(circle, rgba(138,43,226,0.12) 0%, transparent 70%);"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px]"
         style="background: radial-gradient(circle, rgba(0,102,255,0.10) 0%, transparent 70%);"></div>
    <div class="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full blur-[100px]"
         style="background: radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 70%);"></div>
  </div>

  <div class="relative w-full max-w-md">

    <!-- Brand mark -->
    <div class="text-center mb-10 space-y-3">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl luna-glass mb-2">
        <span class="text-3xl drop-shadow-[0_0_12px_rgba(138,43,226,0.8)]">🌙</span>
      </div>
      <div>
        <h1 class="text-2xl font-black tracking-tight">Luna Labs</h1>
        <p class="text-xs text-luna-gold uppercase tracking-[0.3em] font-bold mt-1">Admin Hub</p>
      </div>
      <p class="text-luna-text-muted text-sm">Restricted access. Authorised personnel only.</p>
    </div>

    <!-- Login card -->
    <div class="luna-glass rounded-2xl p-8 space-y-6">

      <!-- Success state — magic link sent -->
      {#if form?.magicLinkSent}
        <div class="text-center space-y-4 py-4">
          <div class="text-5xl">📬</div>
          <div>
            <h2 class="font-black text-xl">Check your inbox.</h2>
            <p class="text-luna-text-muted text-sm mt-2">
              We sent a login link to <span class="text-white font-bold">{form.email}</span>.
              It expires in 1 hour.
            </p>
          </div>
          <p class="text-luna-text-muted text-xs">
            Didn't receive it? Check your spam folder, or
            <button
              onclick={() => { /* form resets on navigation */ window.location.reload(); }}
              class="text-luna-neon underline underline-offset-2"
            >
              try again
            </button>.
          </p>
        </div>

      {:else}
        <!-- Mode toggle -->
        <div class="flex rounded-xl overflow-hidden" style="border: 1px solid var(--color-luna-border);">
          <button
            type="button"
            onclick={() => loginMode = 'magic'}
            class="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200"
            class:bg-luna-blue={loginMode === 'magic'}
            class:text-white={loginMode === 'magic'}
            class:text-luna-text-muted={loginMode !== 'magic'}
          >
            Magic Link
          </button>
          <button
            type="button"
            onclick={() => loginMode = 'password'}
            class="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200"
            class:bg-luna-blue={loginMode === 'password'}
            class:text-white={loginMode === 'password'}
            class:text-luna-text-muted={loginMode !== 'password'}
          >
            Password
          </button>
        </div>

        <!-- Error -->
        {#if form?.error}
          <div
            class="rounded-xl px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            role="alert"
          >
            {form.error}
          </div>
        {/if}

        <!-- Magic link form -->
        {#if loginMode === 'magic'}
          <form
            method="POST"
            action="?/magiclink"
            use:enhance={() => {
              isLoading = true;
              return async ({ update }) => { await update(); isLoading = false; };
            }}
            class="space-y-4"
          >
            <div>
              <label for="magic-email" class="login-label">Email address</label>
              <input
                id="magic-email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@yourdomain.com"
                required
                class="login-input"
              />
            </div>
            <button
              type="submit"
              class="btn-luna-primary w-full py-3.5 text-sm uppercase tracking-wider"
              disabled={isLoading}
            >
              {#if isLoading}
                Sending link...
              {:else}
                Send Magic Link →
              {/if}
            </button>
          </form>

          <p class="text-center text-xs text-luna-text-muted">
            A one-time login link will be sent to your email.
            No password required.
          </p>

        <!-- Password form -->
        {:else}
          <form
            method="POST"
            action="?/password"
            use:enhance={() => {
              isLoading = true;
              return async ({ update }) => { await update(); isLoading = false; };
            }}
            class="space-y-4"
          >
            <div>
              <label for="pw-email" class="login-label">Email address</label>
              <input
                id="pw-email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@yourdomain.com"
                required
                class="login-input"
              />
            </div>
            <div>
              <label for="password" class="login-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                placeholder="••••••••"
                required
                class="login-input"
              />
            </div>
            <button
              type="submit"
              class="btn-luna-primary w-full py-3.5 text-sm uppercase tracking-wider"
              disabled={isLoading}
            >
              {#if isLoading}Signing in...{:else}Sign In →{/if}
            </button>
          </form>
        {/if}
      {/if}

    </div>

    <!-- Footer note -->
    <p class="text-center text-[10px] text-white/20 mt-6 uppercase tracking-widest">
      Luna Labs Admin — Restricted Access
    </p>
  </div>
</div>

<style>
  .login-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-luna-text-muted);
    margin-bottom: 6px;
  }
  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--color-luna-border);
    border-radius: 10px;
    padding: 12px 14px;
    color: #fff;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-input::placeholder { color: rgba(160,155,186,0.4); }
  .login-input:focus {
    border-color: rgba(0,240,255,0.4);
    box-shadow: 0 0 0 3px rgba(0,240,255,0.08);
  }
</style>