<script lang="ts">
  import { onMount } from 'svelte';

  /**
   * Svelte 5 runes.
   * $state() makes these values reactive — the template re-renders
   * when they change, exactly like Svelte 4's `let` but explicit.
   */
  let isScrolled     = $state(false);
  let mobileMenuOpen = $state(false);

  onMount(() => {
    /**
     * FIX: Use addEventListener instead of window.onscroll.
     * window.onscroll is a single global slot — assigning to it overwrites
     * any other scroll handler on the page (e.g. from libraries or other
     * components). addEventListener stacks safely.
     *
     * { passive: true } tells the browser this listener never calls
     * preventDefault(), which unlocks GPU-threaded scroll compositing.
     * Measurable perf difference on mid-range Android devices.
     */
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup: remove listener when the component unmounts (e.g. route change)
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMenu() {
    mobileMenuOpen = false;
  }

  /**
   * Nav links defined as data so adding a new page is a one-line change,
   * not a template edit. This also makes it easy to mark items "active"
   * later via SvelteKit's $page store.
   */
  const navLinks = [
    { href: '#services',  label: 'Services'  },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#process',   label: 'Process'   },
  ] as const;
</script>

<!--
  z-[100] keeps the navbar above page content.
  FIX: class: directives instead of template-string class construction.
  Tailwind 4's JIT scanner reliably detects class: directives; it may miss
  dynamically constructed strings like `{isScrolled ? 'pt-2' : 'pt-6'}`.
-->
<nav
  class="fixed top-0 w-full z-[100] transition-all duration-500"
  class:pt-2={isScrolled}
  class:pt-6={!isScrolled}
  aria-label="Site navigation"
>
  <div class="luna-glass mx-auto max-w-7xl px-6 py-3 rounded-full flex justify-between items-center">

    <!-- ── Brand Logo ─────────────────────────────────────────────── -->
    <a href="#" class="flex items-center gap-3 group" aria-label="Luna Labs — home">
      <span class="text-2xl transition-transform group-hover:rotate-12" aria-hidden="true">🌙</span>
      <div class="flex flex-col leading-none">
        <span class="font-black tracking-tighter text-xl">LUNA</span>
        <span class="text-[8px] text-luna-gold uppercase tracking-[0.3em] font-bold">Labs</span>
      </div>
    </a>

    <!-- ── Desktop Nav Links ──────────────────────────────────────── -->
    <div
      class="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-luna-text-muted"
      role="list"
    >
      {#each navLinks as link (link.href)}
        <a
          href={link.href}
          class="hover:text-luna-neon transition-colors focus-visible:text-luna-neon focus-visible:outline-none"
          role="listitem"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <!-- ── Right Side: CTA + Burger ──────────────────────────────── -->
    <div class="flex items-center gap-4">
      <!-- CTA: hidden on xs to give burger room -->
      <button class="btn-luna-primary py-2 px-5 text-xs uppercase tracking-tighter font-bold hidden sm:block">
        Estimate Project
      </button>

      <!--
        Burger button — mobile only.
        aria-expanded communicates open/closed state to screen readers.
        aria-controls links the button to the menu it controls.
        z-[110] keeps it above the mobile menu panel it opens.
      -->
      <button
        class="md:hidden flex flex-col gap-1.5 z-[110] p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luna-neon rounded"
        onclick={toggleMenu}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
        <!--
          Three bars animate into an X when open.
          FIX: class: directives replace template-string conditionals.
        -->
        <div
          class="h-0.5 w-6 bg-white transition-all duration-300 origin-center"
          class:rotate-45={mobileMenuOpen}
          class:translate-y-2={mobileMenuOpen}
        ></div>
        <div
          class="h-0.5 w-6 bg-luna-gold transition-all duration-300"
          class:opacity-0={mobileMenuOpen}
          class:scale-x-0={mobileMenuOpen}
        ></div>
        <div
          class="h-0.5 w-6 bg-white transition-all duration-300 origin-center"
          class:-rotate-45={mobileMenuOpen}
          class:-translate-y-2={mobileMenuOpen}
        ></div>
      </button>
    </div>
  </div>

  <!-- ── Mobile Menu Panel ────────────────────────────────────────── -->
  <!--
    id="mobile-menu" matches the burger's aria-controls.
    Rendered conditionally — this removes it from the DOM (and tab order)
    when closed, so keyboard users can't accidentally tab into hidden links.
  -->
  {#if mobileMenuOpen}
    <div
      id="mobile-menu"
      class="absolute top-full left-4 right-4 mt-4 luna-glass p-8 rounded-3xl flex flex-col gap-6 md:hidden shadow-2xl"
      role="dialog"
      aria-label="Mobile navigation menu"
    >
      {#each navLinks as link (link.href)}
        <a href={link.href} onclick={closeMenu} class="text-sm font-bold uppercase tracking-[0.2em] hover:text-luna-neon transition-colors focus-visible:text-luna-neon focus-visible:outline-none">
          {link.label}
        </a>
      {/each}

      <!-- CTA inside mobile menu — only shows on truly tiny screens -->
      <button class="btn-luna-primary py-4 w-full text-xs uppercase font-bold sm:hidden">
        Estimate Project
      </button>
    </div>
  {/if}
</nav>