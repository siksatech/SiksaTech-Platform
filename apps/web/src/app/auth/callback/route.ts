/**
 * OAuth Callback Route Handler
 *
 * Supabase exchanges the OAuth code for a session here.
 * After exchange, redirects to /dashboard or the original page.
 */
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code     = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  if (code) {
    const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseAnonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

    let response = NextResponse.redirect(new URL(redirectTo, origin));

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          response = NextResponse.redirect(new URL(redirectTo, origin));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(new URL("/auth/login?error=oauth_failed", origin));
}
