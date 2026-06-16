<script lang="ts">
  import { onMount } from 'svelte';

  let isScrolled = $state(false);
  let mobileMenuOpen = $state(false);

  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 20;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

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

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#quote', label: 'Quote' },
  ] as const;
</script>

<nav
  class="fixed left-0 right-0 top-0 z-[100] w-full max-w-[100vw] transition-all duration-500"
  class:pt-2={isScrolled}
  class:pt-3={!isScrolled}
  class:sm:pt-6={!isScrolled}
  aria-label="Site navigation"
>
  <div class="luna-glass mx-auto flex w-[calc(100vw-1rem)] max-w-7xl items-center justify-between rounded-full px-4 py-2.5 sm:w-[calc(100vw-2rem)] sm:px-6 sm:py-3">
    <a href="/" class="group flex min-w-0 items-center gap-2 sm:gap-3" aria-label="Luna Labs - home">
      <span class="text-xl transition-transform group-hover:rotate-12 sm:text-2xl" aria-hidden="true">🌙</span>
      <div class="flex min-w-0 flex-col leading-none">
        <span class="text-base font-black tracking-tighter sm:text-xl">LUNA</span>
        <span class="text-[8px] text-luna-gold uppercase tracking-[0.3em] font-bold">Labs</span>
      </div>
    </a>

    <ul class="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-luna-text-muted">
      {#each navLinks as link (link.href)}
        <li>
          <a
            href={link.href}
            class="hover:text-luna-neon transition-colors focus-visible:text-luna-neon focus-visible:outline-none"
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <div class="flex min-w-0 items-center gap-2 sm:gap-4">
      <a href="#quote" class="btn-luna-primary hidden md:block py-2 px-5 text-xs uppercase tracking-tighter font-bold">
        Estimate Project
      </a>

      <button
        class="md:hidden flex flex-col gap-1.5 z-[110] p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luna-neon rounded"
        onclick={toggleMenu}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="mobile-menu"
      >
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

  {#if mobileMenuOpen}
    <div
      id="mobile-menu"
      class="absolute top-full left-2 right-2 mt-3 luna-glass p-6 rounded-2xl flex flex-col gap-5 md:hidden shadow-2xl sm:left-4 sm:right-4 sm:p-8 sm:rounded-3xl"
      role="dialog"
      aria-label="Mobile navigation menu"
    >
      {#each navLinks as link (link.href)}
        <a href={link.href} onclick={closeMenu} class="text-sm font-bold uppercase tracking-[0.2em] hover:text-luna-neon transition-colors focus-visible:text-luna-neon focus-visible:outline-none">
          {link.label}
        </a>
      {/each}

      <a href="#quote" onclick={closeMenu} class="btn-luna-primary py-4 w-full text-center text-xs uppercase font-bold md:hidden">
        Estimate Project
      </a>
    </div>
  {/if}
</nav>
