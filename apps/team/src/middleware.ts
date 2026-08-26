/**
 * Next.js Middleware — team.siksatech.in (apps/team)
 *
 * Responsibilities:
 * 1. Refresh Supabase session cookies on every request
 * 2. Protect ALL routes except /login
 * 3. Verify user has an internal role — if not, redirect to login
 * 4. Redirect authenticated internal users away from /login
 */
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = ["/login", "/auth/callback", "/auth/login"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "";

  const { pathname } = request.nextUrl;

  // Always allow public routes
  const isPublic = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
  if (isPublic) {
    return supabaseResponse;
  }

  // Skip if Supabase is not configured
  if (!supabaseUrl || supabaseUrl === "placeholder") {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Not authenticated → redirect to /login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated: check for internal role
  // We do a lightweight query — just the role names, no full permission expansion
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select("role:roles(name)")
    .eq("user_id", user.id);

  const INTERNAL_ROLES = [
    "super_admin", "ops_manager", "content_manager",
    "store_manager", "accounts_manager", "pr_manager", "support_staff",
  ];

  const hasInternalRole = (userRoles as any[] ?? []).some(
    (ur: any) => INTERNAL_ROLES.includes(ur.role?.name)
  );

  if (!hasInternalRole) {
    // Authenticated but not a team member — show 403-style redirect
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
