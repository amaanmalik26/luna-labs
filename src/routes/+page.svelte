<script lang="ts">
  import HeroCodeCard   from '$lib/components/HeroCodeCard.svelte';
  import StarField      from '$lib/components/StarField.svelte';
  import ServicesGrid   from '$lib/components/ServicesGrid.svelte';
  import PortfolioGrid  from '$lib/components/PortfolioGrid.svelte';
</script>

<!-- ─── Hero Section ───────────────────────────────────────────────────
  position:relative required — StarField uses absolute inset-0.
  overflow-hidden clips the canvas + aura orbs at section boundary.
──────────────────────────────────────────────────────────────────────── -->
<section
  class="relative min-h-[90vh] flex items-center px-6 lg:px-32 overflow-hidden"
  aria-label="Hero — Luna Labs introduction"
>
  <!-- StarField: twinkling star canvas + drifting aura orbs — z-0 -->
  <StarField />

  <!-- Main grid — z-10 keeps it above StarField -->
  <div class="relative z-10 grid lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">

    <!-- ── Left: Copy ───────────────────────────────────────────── -->
    <div class="space-y-8">

      <!-- Brand badge -->
      <div class="flex items-center gap-4" aria-hidden="true">
        <div class="relative">
          <span class="text-5xl drop-shadow-[0_0_15px_rgba(138,43,226,0.8)]">🌙</span>
          <div class="absolute inset-0 bg-luna-purple/20 blur-xl rounded-full scale-150 pointer-events-none"></div>
        </div>
        <div class="flex flex-col">
          <span class="text-luna-gold tracking-[0.4em] font-bold uppercase text-xs">Luna Labs</span>
          <span class="text-[10px] text-luna-text-muted uppercase tracking-[0.2em]">Digital Arc Architects</span>
        </div>
      </div>

      <h1 class="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight">
        Building <br />
        <span class="text-luna-gradient">Systems That Flow.</span>
      </h1>

      <p class="text-luna-text-muted text-lg lg:text-xl max-w-lg leading-relaxed font-medium">
        We design and develop premium full-stack platforms for businesses looking
        to scale their digital presence with precision.
      </p>

      <div class="flex flex-wrap gap-6 pt-4">
        <!-- TODO Ticket Phase 2: swap to <button> opening modal when form is built -->
        <a href="#quote" class="btn-luna-primary shadow-lg shadow-luna-blue/20 inline-block">
          Start a Project
        </a>
        <a
          href="#portfolio"
          class="group flex items-center gap-2 text-luna-gold font-bold tracking-wide hover:text-white transition-colors focus-visible:outline-none focus-visible:text-luna-neon"
        >
          <span>View Concept Portfolio</span>
          <span class="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </a>
      </div>
    </div>

    <!-- ── Right: Animated Terminal ─────────────────────────────── -->
    <div class="relative hidden lg:block" aria-hidden="true">
      <div
        class="absolute -inset-20 bg-luna-purple/10 blur-[100px] rounded-full pointer-events-none"
        style="animation: pulse 4s ease-in-out infinite alternate;"
      ></div>
      <div class="relative transform hover:scale-[1.02] transition-transform duration-700 ease-out">
        <HeroCodeCard />
      </div>
      <div
        class="absolute -bottom-6 -right-6 w-32 h-32 rounded-br-3xl pointer-events-none"
        style="border-bottom: 1px solid rgba(212,175,55,0.2); border-right: 1px solid rgba(212,175,55,0.2);"
      ></div>
    </div>

  </div>
</section>


<!-- ─── Services Section (Ticket #7 / Issue #8) ────────────────────────
  ServicesGrid is a self-contained section component — it owns its own
  <section> tag, heading, and id="services" anchor.
──────────────────────────────────────────────────────────────────────── -->
<ServicesGrid />


<!-- ─── Portfolio Section (Ticket #7 / Issue #8) ──────────────────────
  Same pattern — PortfolioGrid owns its <section> tag and id="portfolio".
──────────────────────────────────────────────────────────────────────── -->
<PortfolioGrid />


<!-- ─── Quote / Lead Capture (TODO Phase 2 — Ticket #9) ───────────────
  id="quote" is the anchor target for the Hero "Start a Project" CTA.
  TODO Phase 2: replace h2 placeholder with <RequestQuoteForm />.
──────────────────────────────────────────────────────────────────────── -->
<section
  id="quote"
  class="min-h-[60vh] px-6 lg:px-32 py-24 flex items-center"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-label="Request a quote — placeholder"
>
  <div class="max-w-7xl mx-auto w-full">
    <h2 class="text-4xl font-bold tracking-tighter uppercase opacity-20">
      Start a Project
    </h2>
    <!-- TODO Phase 2 Ticket #9: <RequestQuoteForm /> goes here -->
  </div>
</section>