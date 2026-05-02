<script lang="ts">
  import HeroCodeCard from '$lib/components/HeroCodeCard.svelte';
  import StarField    from '$lib/components/StarField.svelte';
</script>

<!-- ─── Hero Section ───────────────────────────────────────────────────
  position:relative is required — StarField uses position:absolute inset-0
  so it needs a positioned ancestor to fill correctly.

  overflow-hidden clips both the StarField canvas and the old orbs at the
  section boundary, preventing horizontal scroll.
──────────────────────────────────────────────────────────────────────── -->
<section
  class="relative min-h-[90vh] flex items-center px-6 lg:px-32 overflow-hidden"
  aria-label="Hero — Luna Labs introduction"
>

  <!--
    StarField sits at z-0, behind everything.
    It renders the twinkling star canvas + three drifting aura orbs.
    aria-hidden is set on the component's root element internally.
  -->
  <StarField />

  <!-- ── Main Grid — z-10 keeps it above the StarField layer ─────── -->
  <div class="relative z-10 grid lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">

    <!-- ── Left Column: Copy ──────────────────────────────────────── -->
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

      <!-- h1 — single per page, gradient span is purely visual -->
      <h1 class="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight">
        Building <br />
        <span class="text-luna-gradient">Systems That Flow.</span>
      </h1>

      <!-- Subtext -->
      <p class="text-luna-text-muted text-lg lg:text-xl max-w-lg leading-relaxed font-medium">
        We design and develop premium full-stack platforms for businesses looking
        to scale their digital presence with precision.
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap gap-6 pt-4">
        <!--
          <a> not <button> — scrolling to a section is navigation.
          TODO Ticket 6: swap to <button> opening a modal when form is built.
        -->
        <a
          href="#quote"
          class="btn-luna-primary shadow-lg shadow-luna-blue/20 inline-block"
        >
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

    <!-- ── Right Column: Animated Terminal ───────────────────────── -->
    <!--
      hidden lg:block — terminal is decorative on mobile.
      aria-hidden because the terminal content is purely visual/branding,
      not actual navigable content.
    -->
    <div class="relative hidden lg:block" aria-hidden="true">
      <!-- Extra ambient glow specifically behind the terminal card -->
      <div
        class="absolute -inset-20 bg-luna-purple/10 blur-[100px] rounded-full pointer-events-none"
        style="animation: pulse 4s ease-in-out infinite alternate;"
      ></div>

      <!-- Hover-lift wrapper -->
      <div class="relative transform hover:scale-[1.02] transition-transform duration-700 ease-out">
        <HeroCodeCard />
      </div>

      <!-- Decorative gold corner accent -->
      <div
        class="absolute -bottom-6 -right-6 w-32 h-32 rounded-br-3xl pointer-events-none"
        style="
          border-bottom: 1px solid rgba(212,175,55,0.2);
          border-right:  1px solid rgba(212,175,55,0.2);
        "
      ></div>
    </div>

  </div>
</section>


<!-- ─────────────────────────────────────────────────────────────────────
  TODO Ticket 3 (Issue #8): Services Section
  Replace placeholder with <ServicesGrid /> component.
  id="services" is the Navbar anchor target.
──────────────────────────────────────────────────────────────────────── -->
<section
  id="services"
  class="min-h-screen px-6 lg:px-32 py-24"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-label="Services — placeholder"
>
  <h2 class="text-4xl font-bold tracking-tighter uppercase opacity-20">
    Architectural Services
  </h2>
  <!-- TODO Ticket #8: <ServicesGrid /> goes here -->
</section>


<!-- ─────────────────────────────────────────────────────────────────────
  TODO Ticket 3 (Issue #8): Portfolio Section
  Replace placeholder with <PortfolioGrid /> component.
──────────────────────────────────────────────────────────────────────── -->
<section
  id="portfolio"
  class="min-h-screen px-6 lg:px-32 py-24"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-label="Portfolio — placeholder"
>
  <h2 class="text-4xl font-bold tracking-tighter uppercase opacity-20">
    Concept Portfolio
  </h2>
  <!-- TODO Ticket #8: <PortfolioGrid /> goes here -->
</section>


<!-- ─────────────────────────────────────────────────────────────────────
  TODO Ticket 6 (Issue #9 / Phase 2): Quote / Lead Capture Section
  id="quote" is the Hero "Start a Project" CTA target.
──────────────────────────────────────────────────────────────────────── -->
<section
  id="quote"
  class="min-h-[60vh] px-6 lg:px-32 py-24"
  style="border-top: 1px solid var(--color-luna-border);"
  aria-label="Request a quote — placeholder"
>
  <h2 class="text-4xl font-bold tracking-tighter uppercase opacity-20">
    Start a Project
  </h2>
  <!-- TODO Ticket #9 Phase 2: <RequestQuoteForm /> goes here -->
</section>