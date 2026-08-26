/**
 * Server-side auth helpers for Next.js App Router.
 *
 * These helpers create the SSR-safe Supabase client from next/headers
 * and expose convenient session utilities.
 *
 * Usage in Server Components:
 *   import { createSupabaseServerClient, getServerSessionUser } from "@siksatech/auth/server";
 */
import { cookies } from "next/headers";
import { createServerClient as _createServerClient } from "@supabase/ssr";
import type { Database } from "@siksatech/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

/**
 * Create a server-side Supabase client that reads/writes cookies
 * from the Next.js request context (next/headers).
 *
 * Use this in Server Components, Server Actions, and Route Handlers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return _createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Server Components cannot set cookies — safe to ignore
          }
        });
      },
    },
  });
}

/**
 * Get the current authenticated user's session data server-side.
 * Returns null if not authenticated.
 */
export async function getServerUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Get the full session user (profile + roles + permissions).
 * Use in Server Components and Server Actions.
 */
export async function getServerSessionUser() {
  const supabase = await createSupabaseServerClient();
  const { getSessionUser } = await import("@siksatech/database");
  return getSessionUser(supabase as any);
}
