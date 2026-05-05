<script lang="ts">
  /**
   * ScrollReveal.svelte
   *
   * A wrapper component that animates its children into view when they
   * enter the viewport. Uses IntersectionObserver — no scroll listeners,
   * no layout thrashing, GPU-composited transforms only.
   *
   * Props:
   *   delay    — animation delay in ms (default 0). Use to stagger siblings.
   *   distance — how far the element slides up from (default 32px).
   *   duration — animation duration in ms (default 600).
   *   once     — if true (default), only animates the first time (no replay on scroll back).
   *
   * Usage:
   *   <ScrollReveal delay={200}>
   *     <YourComponent />
   *   </ScrollReveal>
   *
   *   Stagger children:
   *   {#each items as item, i}
   *     <ScrollReveal delay={i * 120}>
   *       <Card {item} />
   *     </ScrollReveal>
   *   {/each}
   */

  import { onMount } from 'svelte';

  let {
    delay    = 0,
    distance = 32,
    duration = 600,
    once     = true,
    children,
  }: {
    delay?:    number;
    distance?: number;
    duration?: number;
    once?:     boolean;
    children:  any;
  } = $props();

  let el      = $state<HTMLDivElement | null>(null);
  let visible = $state(false);

  onMount(() => {
    // Respect prefers-reduced-motion — skip animation entirely
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      visible = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible = true;
            if (once) observer.disconnect();
          } else if (!once) {
            visible = false;
          }
        }
      },
      {
        // Start animating when 10% of the element is in view
        threshold:  0.1,
        // Negative rootMargin triggers slightly before the element fully enters
        rootMargin: '0px 0px -40px 0px',
      },
    );

    if (el) observer.observe(el);

    return () => observer.disconnect();
  });
</script>

<!--
  The outer div is the observation target and the animation host.
  All animation properties are set via inline CSS custom properties
  so each ScrollReveal instance can have its own delay/duration/distance
  without injecting separate style blocks.

  will-change: transform, opacity — tells the browser to promote this
  element to its own compositor layer, enabling GPU-accelerated animation.
  We only set it on elements that will actually animate, not globally.
-->
<div
  bind:this={el}
  class="scroll-reveal"
  class:scroll-reveal--visible={visible}
  style="
    --sr-delay:    {delay}ms;
    --sr-duration: {duration}ms;
    --sr-distance: {distance}px;
  "
>
  {@render children()}
</div>

<style>
  .scroll-reveal {
    opacity:   0;
    transform: translateY(var(--sr-distance));
    transition:
      opacity   var(--sr-duration) ease var(--sr-delay),
      transform var(--sr-duration) cubic-bezier(0.22, 1, 0.36, 1) var(--sr-delay);
    will-change: transform, opacity;
  }

  .scroll-reveal--visible {
    opacity:   1;
    transform: translateY(0);
  }
</style>