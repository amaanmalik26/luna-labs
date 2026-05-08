<script lang="ts">
  import { page } from '$app/stores';
  import { resolve } from '$app/paths';

  let { children, data } = $props();

  // Navigation items — icons are inline SVG paths for zero-dep icons
  const navItems = [
    {
      href:  '/admin',
      label: 'Dashboard',
      icon:  'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      exact: true,
    },
    {
      href:  '/admin/leads',
      label: 'Leads',
      icon:  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      exact: false,
    },
  ] as const;

  // Check active state
  function isActive(href: string, exact: boolean): boolean {
    if (exact) return $page.url.pathname === href;
    return $page.url.pathname.startsWith(href);
  }

  // Sign out action
  async function signOut() {
    await fetch('/admin/signout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  let sidebarOpen = $state(false);
</script>

<!--
  Admin layout is completely separate from the public layout.
  No Navbar, no Footer, no StarField.
  This is an internal tool — clean, functional, dark.
-->
<div class="min-h-screen flex bg-luna-base text-luna-text-main font-sans">

  <!-- ── Sidebar ────────────────────────────────────────────────── -->
  <aside
    class="
      fixed inset-y-0 left-0 z-50 w-64 flex flex-col
      bg-[#0D0B1A] border-r transition-transform duration-300
      lg:translate-x-0 lg:static lg:z-auto
    "
    style="border-color: var(--color-luna-border);"
    class:-translate-x-full={!sidebarOpen}
    class:translate-x-0={sidebarOpen}
    aria-label="Admin navigation"
  >
    <!-- Brand -->
    <div class="px-6 py-6 flex items-center gap-3" style="border-bottom: 1px solid var(--color-luna-border);">
      <span class="text-2xl">🌙</span>
      <div>
        <p class="font-black tracking-tighter text-sm">LUNA LABS</p>
        <p class="text-[9px] text-luna-gold uppercase tracking-[0.3em]">Admin Hub</p>
      </div>
    </div>

    <!-- Nav links -->
    <nav class="flex-1 px-3 py-6 space-y-1" aria-label="Admin sections">
      {#each navItems as item (item.href)}
        <a
          href={resolve(item.href)}
          onclick={() => sidebarOpen = false}
          class="
            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
            transition-all duration-200
          "
          class:bg-luna-blue={isActive(item.href, item.exact)}
          class:text-white={isActive(item.href, item.exact)}
          class:shadow-lg={isActive(item.href, item.exact)}
          class:text-luna-text-muted={!isActive(item.href, item.exact)}
          class:hover:bg-white={!isActive(item.href, item.exact)}
          class:hover:bg-opacity-5={!isActive(item.href, item.exact)}
          aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
        >
          <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
          </svg>
          {item.label}

          {#if item.label === 'Leads' && isActive(item.href, item.exact)}
            <span class="ml-auto bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
          {/if}
        </a>
      {/each}
    </nav>

    <!-- User info + sign out -->
    <div class="px-4 py-5 space-y-3" style="border-top: 1px solid var(--color-luna-border);">
      {#if data.session?.user}
        <div class="flex items-center gap-3 px-3">
          <!-- Avatar initials -->
          <div class="w-8 h-8 rounded-full bg-luna-purple/30 border border-luna-purple/40 flex items-center justify-center text-xs font-black text-luna-purple shrink-0">
            {data.session.user.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold truncate">{data.session.user.email}</p>
            <p class="text-[10px] text-luna-gold">Admin</p>
          </div>
        </div>
      {/if}
      <button
        onclick={signOut}
        class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-luna-text-muted hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-200"
      >
        <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  </aside>

  <!-- Mobile sidebar overlay -->
  {#if sidebarOpen}
    <div
      class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
      onclick={() => sidebarOpen = false}
      aria-hidden="true"
    ></div>
  {/if}

  <!-- ── Main content area ─────────────────────────────────────── -->
  <div class="flex-1 flex flex-col min-w-0">

    <!-- Top bar -->
    <header
      class="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#0D0B1A]/80 backdrop-blur-lg"
      style="border-bottom: 1px solid var(--color-luna-border);"
    >
      <!-- Mobile burger -->
      <button
        class="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
        onclick={() => sidebarOpen = !sidebarOpen}
        aria-label="Toggle sidebar"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <!-- Page title is rendered inside each page instead of via a header slot -->
      <div class="flex-1 lg:ml-0 ml-4"></div>

      <!-- Live indicator -->
      <div class="flex items-center gap-2 text-xs text-luna-text-muted">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        Live
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-auto p-6 lg:p-8">
      {@render children()}
    </main>
  </div>
</div>