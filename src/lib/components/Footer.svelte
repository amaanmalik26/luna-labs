<script lang="ts">
  /**
   * new Date().getFullYear() runs once at SSR render time and is baked
   * into the HTML. That is correct behaviour — the year doesn't change
   * while someone is on the page, and it keeps the footer static/cacheable.
   */
  const year = new Date().getFullYear();

  const solutions = [
    { href: '#services',  label: 'Web Systems'  },
    { href: '#services',  label: 'UI/UX Design' },
    { href: '#services',  label: 'Custom SaaS'  },
  ] as const;
</script>

<!--
  <footer> is a landmark element — screen readers announce it as "content info".
  border uses the luna-border token for consistency with Navbar and glass cards.
-->
<footer
  class="relative mt-24 px-6 py-12 lg:px-24 bg-luna-base"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-label="Site footer"
>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">

    <!-- ── Brand Block ──────────────────────────────────────────── -->
    <div class="space-y-4 col-span-1 md:col-span-2">
      <a href="/" class="flex items-center gap-2 group w-fit" aria-label="Luna Labs — home">
        <span class="text-2xl transition-transform group-hover:rotate-12" aria-hidden="true">🌙</span>
        <span class="text-2xl font-black tracking-tighter">LUNA LABS</span>
      </a>
      <p class="text-luna-text-muted max-w-sm text-sm leading-relaxed">
        Digital Architects. Building high-performance systems and premium
        web experiences for the next generation of businesses.
      </p>
    </div>

    <!-- ── Solutions Nav ───────────────────────────────────────── -->
    <!--
      <nav> inside <footer> gives screen readers a named navigation landmark.
      This is separate from the main <nav> in the Navbar component.
    -->
    <nav aria-label="Solutions">
      <h4 class="text-luna-gold text-xs font-bold uppercase tracking-widest mb-4">
        Solutions
      </h4>
      <ul class="text-luna-text-muted text-sm space-y-2">
        {#each solutions as item}
          <li>
            <a
              href={item.href}
              class="hover:text-white transition-colors focus-visible:text-luna-neon focus-visible:outline-none"
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <!-- ── Contact Block ───────────────────────────────────────── -->
    <div>
      <h4 class="text-luna-gold text-xs font-bold uppercase tracking-widest mb-4">
        Connect
      </h4>
      <ul class="text-luna-text-muted text-sm space-y-2">
        <li>Lahore, Pakistan</li>
        <li>
          <a
            href="mailto:lunalabs2026@outlook.com"
            class="hover:text-white transition-colors focus-visible:text-luna-neon focus-visible:outline-none"
          >
            lunalabs2026@outlook.com
          </a>
        </li>
      </ul>
    </div>
  </div>

  <!-- ── Copyright Bar ─────────────────────────────────────────── -->
  <div
    class="mt-12 pt-8 text-center"
    style="border-top: 1px solid var(--color-luna-border);"
  >
    <!--
      <small> is semantically correct for legal/copyright text.
      aria-hidden on the em-dash keeps screen readers from reading "dash".
    -->
    <small class="text-[10px] text-white/20 uppercase tracking-[0.5em] not-italic">
      &copy; {year} Luna Labs <span aria-hidden="true">—</span> Digital Architects
    </small>
  </div>
</footer>