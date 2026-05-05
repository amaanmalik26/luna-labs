/**
 * src/app.d.ts
 *
 * SvelteKit global TypeScript declarations.
 * Augments the App namespace so event.locals is fully typed
 * across all hooks, load functions, and server endpoints.
 *
 * Add to this file as you introduce new locals in hooks.server.ts.
 */

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface Locals {
      /**
       * Supabase session — null when unauthenticated.
       * Populated in hooks.server.ts after Phase 3 auth setup.
       * Type will be: import('@supabase/supabase-js').Session | null
       */
      session: null; // Widen to `Session | null` in Phase 3
    }

    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};