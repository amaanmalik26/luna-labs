// src/app.d.ts
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      session:  Session | null;
      /**
       * isAdmin is set in hooks.server.ts after verifying the session
       * email is in the allowed_admins table. Used by admin layout.server.ts
       * to gate every admin route without hitting the DB on each request.
       */
      isAdmin:  boolean;
    }
    interface PageData {
      session: Session | null;
    }
  }
}

export {};