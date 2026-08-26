/**
 * Supabase client factories for SiksaTech
 *
 * - createBrowserClient: use in Client Components ("use client")
 * - createServerClient: use in Server Components, Server Actions, Route Handlers
 * - createAdminClient: use only in server-side contexts that need to bypass RLS
 *
 * Never import createAdminClient in the browser bundle.
 */

import { createBrowserClient as _createBrowserClient } from "@supabase/ssr";
import { createServerClient as _createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

export type SupabaseClient = ReturnType<typeof _createBrowserClient<Database>>;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

export const isRealSupabase =
  !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== "placeholder";

// ─────────────────────────────────────────────────────────────
// BROWSER CLIENT
// Use inside Client Components.
// ─────────────────────────────────────────────────────────────
export function createBrowserClient() {
  return _createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// ─────────────────────────────────────────────────────────────
// SERVER CLIENT
// Use in Server Components, Server Actions, and Route Handlers.
// Requires a cookies() adapter from next/headers.
// ─────────────────────────────────────────────────────────────
export function createServerClient(
  cookieStore: {
    get: (name: string) => { value: string } | undefined;
    set: (name: string, value: string, options: CookieOptions) => void;
  }
) {
  return _createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        // The cookie store is the ReadonlyRequestCookies from next/headers
        return Object.entries(cookieStore).flatMap(([key]) => {
          const cookie = cookieStore.get(key);
          return cookie ? [{ name: key, value: cookie.value }] : [];
        });
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // In Server Components cookies().set() throws — safe to ignore
          }
        });
      },
    },
  });
}

// ─────────────────────────────────────────────────────────────
// ADMIN CLIENT (server-only)
// Bypasses RLS — only for privileged server operations.
// Never expose this client to the browser.
// ─────────────────────────────────────────────────────────────
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
