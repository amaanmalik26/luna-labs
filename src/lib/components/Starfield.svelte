<script lang="ts">
  import { onMount } from 'svelte';

  /**
   * StarField — renders a canvas of twinkling stars plus three CSS aura orbs.
   *
   * WHY CANVAS FOR STARS:
   * Putting 150 DOM nodes for individual stars would be expensive for the
   * browser's layout engine. Canvas draws everything in a single composited
   * layer — no extra DOM nodes, no reflow, GPU-accelerated via requestAnimationFrame.
   *
   * WHY CSS FOR AURAS:
   * The three large blur orbs are cheap as CSS — they're just border-radius
   * divs with filter:blur(). No canvas needed and they animate smoothly with
   * CSS keyframes on transform + opacity.
   */

  let canvas = $state<HTMLCanvasElement | null>(null);

  interface Star {
    x: number;
    y: number;
    radius: number;
    opacity: number;        // current opacity
    opacityTarget: number;  // opacity we're animating toward
    opacitySpeed: number;   // how fast opacity changes per frame
    twinkleDelay: number;   // frames to wait before starting to twinkle
  }

  const STAR_COUNT      = 160;
  const MIN_RADIUS      = 0.4;
  const MAX_RADIUS      = 1.6;
  const MIN_OPACITY     = 0.08;
  const MAX_OPACITY     = 0.75;
  const OPACITY_STEP    = 0.006; // opacity delta per frame — slow, dreamy twinkle

  function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  function buildStars(w: number, h: number): Star[] {
    return Array.from({ length: STAR_COUNT }, () => ({
      x:             randomBetween(0, w),
      y:             randomBetween(0, h),
      radius:        randomBetween(MIN_RADIUS, MAX_RADIUS),
      opacity:       randomBetween(MIN_OPACITY, MAX_OPACITY),
      opacityTarget: randomBetween(MIN_OPACITY, MAX_OPACITY),
      opacitySpeed:  randomBetween(OPACITY_STEP * 0.5, OPACITY_STEP * 1.5),
      twinkleDelay:  Math.floor(randomBetween(0, 120)),
    }));
  }

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect reduced-motion: if the user prefers no motion, draw a single
    // static frame and don't start the animation loop.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let stars: Star[] = [];
    let rafId: number;
    let frame = 0;

    function resize() {
      if (!canvas) return;
      // devicePixelRatio makes stars crisp on Retina / HiDPI screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
      stars = buildStars(canvas.offsetWidth, canvas.offsetHeight);
    }

    function drawFrame() {
      if (!canvas || !ctx) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        // Don't start twinkling until the star's delay has passed
        if (frame >= star.twinkleDelay) {
          // Ease opacity toward target
          if (star.opacity < star.opacityTarget) {
            star.opacity = Math.min(star.opacity + star.opacitySpeed, star.opacityTarget);
          } else {
            star.opacity = Math.max(star.opacity - star.opacitySpeed, star.opacityTarget);
          }

          // When target reached, pick a new random target
          if (Math.abs(star.opacity - star.opacityTarget) < 0.005) {
            star.opacityTarget = randomBetween(MIN_OPACITY, MAX_OPACITY);
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      }

      frame++;
      rafId = requestAnimationFrame(drawFrame);
    }

    resize();

    if (prefersReduced) {
      // Static single frame — no animation
      drawFrame();
      cancelAnimationFrame(rafId!);
    } else {
      rafId = requestAnimationFrame(drawFrame);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  });
</script>

<!--
  The component is position:absolute fill-parent so it sits behind
  all page content. The parent section must have position:relative.
  pointer-events:none means clicks pass straight through.
  aria-hidden:true — purely decorative, no AT value.
-->
<div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

  <!-- ── Star canvas ──────────────────────────────────────────────── -->
  <canvas
    bind:this={canvas}
    class="absolute inset-0 w-full h-full"
  ></canvas>

  <!-- ── Aura orb 1 — large purple, top-right ─────────────────────── -->
  <div
    class="aura aura--purple"
    style="
      width: 700px; height: 700px;
      top: -15%; right: -12%;
      animation-duration: 18s;
      animation-delay: 0s;
    "
  ></div>

  <!-- ── Aura orb 2 — deep blue, bottom-left ──────────────────────── -->
  <div
    class="aura aura--blue"
    style="
      width: 500px; height: 500px;
      bottom: -10%; left: -8%;
      animation-duration: 22s;
      animation-delay: -7s;
    "
  ></div>

  <!-- ── Aura orb 3 — neon cyan, center-right, subtle ─────────────── -->
  <div
    class="aura aura--neon"
    style="
      width: 380px; height: 380px;
      top: 30%; right: 18%;
      animation-duration: 28s;
      animation-delay: -14s;
    "
  ></div>

</div>

<style>
  /*
   * Aura orbs — large blurred circles that drift slowly.
   * border-radius: 50% + filter: blur() creates the soft glow effect.
   *
   * We animate transform: translate() rather than top/left/right/bottom
   * because transform is composited on the GPU — zero layout cost.
   */
  .aura {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    animation: drift ease-in-out infinite alternate;
    will-change: transform, opacity;
  }

  .aura--purple {
    background: radial-gradient(
      circle at center,
      rgba(138, 43, 226, 0.18) 0%,
      rgba(138, 43, 226, 0.04) 60%,
      transparent 100%
    );
  }

  .aura--blue {
    background: radial-gradient(
      circle at center,
      rgba(0, 102, 255, 0.14) 0%,
      rgba(0, 102, 255, 0.03) 60%,
      transparent 100%
    );
  }

  .aura--neon {
    background: radial-gradient(
      circle at center,
      rgba(0, 240, 255, 0.08) 0%,
      rgba(0, 240, 255, 0.02) 60%,
      transparent 100%
    );
  }

  /*
   * The drift animation: each orb translates by a different amount
   * giving them independent-feeling movement despite sharing a keyframe.
   * The animation-duration and animation-delay differ per orb (set inline)
   * so they're always out of phase with each other.
   */
  @keyframes drift {
    0%   { transform: translate(0px, 0px)       scale(1);    opacity: 0.7; }
    33%  { transform: translate(30px, -25px)    scale(1.04); opacity: 0.9; }
    66%  { transform: translate(-20px, 20px)    scale(0.97); opacity: 0.75; }
    100% { transform: translate(15px, -15px)    scale(1.02); opacity: 0.85; }
  }

  /* Reduced-motion: no drift, static orbs at base opacity */
  @media (prefers-reduced-motion: reduce) {
    .aura {
      animation: none;
      opacity: 0.6;
    }
  }
</style>