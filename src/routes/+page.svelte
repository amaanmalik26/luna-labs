<script lang="ts">
  import HeroCodeCard     from '$lib/components/HeroCodeCard.svelte';
  import StarField        from '$lib/components/StarField.svelte';
  import ServicesGrid     from '$lib/components/ServicesGrid.svelte';
  import PortfolioGrid    from '$lib/components/PortfolioGrid.svelte';
  import RequestQuoteForm from '$lib/components/RequestQuoteForm.svelte';
  import ScrollReveal     from '$lib/components/ScrollReveal.svelte';
</script>

<svelte:head>
  <title>Luna Labs — Digital Arc Architects</title>
  <meta name="description" content="Luna Labs builds premium full-stack platforms, UI/UX systems, and custom SaaS products for businesses ready to scale their digital presence." />
  <meta property="og:title"       content="Luna Labs — Digital Arc Architects" />
  <meta property="og:description" content="Premium web systems, UI/UX design, and custom SaaS built with precision." />
  <meta property="og:type"        content="website" />
</svelte:head>

<!-- ─── Hero ───────────────────────────────────────────────────────── -->
<section
  class="relative min-h-[90vh] flex items-center px-6 lg:px-32 overflow-hidden"
  aria-label="Hero — Luna Labs introduction"
>
  <StarField />

  <div class="relative z-10 grid lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">

    <!-- Left: copy — fades up on initial page load -->
    <!--
      Hero content uses a CSS animation directly (not ScrollReveal) because
      it's visible immediately on page load — IntersectionObserver fires
      instantly for in-viewport elements, making the animation feel wrong.
      A CSS animation with a short delay feels like a purposeful entrance.
    -->
    <div class="space-y-8 hero-enter">

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

    <!-- Right: terminal — delayed entrance -->
    <div class="relative hidden lg:block hero-enter" style="animation-delay: 300ms;" aria-hidden="true">
      <div class="absolute -inset-20 bg-luna-purple/10 blur-[100px] rounded-full pointer-events-none"></div>
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

<!-- ─── Services ─────────────────────────────────────────────────── -->
<ServicesGrid />

<!-- ─── Portfolio ────────────────────────────────────────────────── -->
<PortfolioGrid />

<!-- ─── Quote Form ───────────────────────────────────────────────── -->
<RequestQuoteForm />

<style>
  /*
   * Hero entrance animation — runs once on page load.
   * Animates opacity + translateY. GPU composited — no layout cost.
   * Uses animation-fill-mode: both so the element starts at the "from"
   * state (invisible, shifted) before the animation begins.
   */
  .hero-enter {
    animation: hero-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes hero-fade-up {
    from {
      opacity:   0;
      transform: translateY(28px);
    }
    to {
      opacity:   1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-enter {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>