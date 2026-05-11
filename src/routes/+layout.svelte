<script lang="ts">
  import './layout.css';
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();

  const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

{#if !isAdminRoute}
  <a
    href="#main-content"
    class="
      sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
      focus:z-[200] focus:px-4 focus:py-2 focus:rounded-full
      focus:bg-luna-blue focus:text-white focus:font-bold focus:text-sm
    "
  >
    Skip to main content
  </a>

  <Navbar />
{/if}

<main
  id="main-content"
  class="relative z-10"
  class:pt-20={!isAdminRoute}
>
  {@render children()}
</main>

{#if !isAdminRoute}
  <Footer />
{/if}
