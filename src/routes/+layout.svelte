<script lang="ts">
  import './layout.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';

  /**
   * Svelte 5: children replaces the legacy <slot />.
   * The layout receives the rendered page as a snippet prop.
   */
  let { children } = $props();
</script>

<!--
  Skip-to-content link — renders first in the DOM so keyboard/screen-reader
  users can jump past the navbar directly to the page body.
  Visually hidden until focused (sr-only + focus:not-sr-only pattern).
-->
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

<!--
  id="main-content" is the skip-link target.
  pt-20 offsets the fixed navbar height.
  relative + z-10 ensures sections render above background blur decorations.
-->
<main id="main-content" class="relative z-10 pt-20">
  {@render children()}
</main>

<Footer />