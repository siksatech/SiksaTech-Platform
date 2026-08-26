/**
 * Server-side profile queries.
 * These functions use the server Supabase client (SSR-safe).
 * They are intended for use in Server Components and Server Actions.
 */
import type { SupabaseClient } from "../client";
import type { Profile, SessionUser } from "../types";

/**
 * Get the current authenticated user's full session context:
 * profile + roles + permissions.
 * Returns null if not authenticated or profile missing.
 */
export async function getSessionUser(
  supabase: SupabaseClient
): Promise<SessionUser | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) return null;

  // Fetch roles + permissions via join
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select(`
      role:roles (
        name,
        role_permissions (
          permission:permissions ( name )
        )
      )
    `)
    .eq("user_id", user.id);

  const roles: string[] = [];
  const permissions = new Set<string>();

  if (userRoles) {
    for (const ur of userRoles as any[]) {
      if (ur.role?.name) {
        roles.push(ur.role.name);
        for (const rp of ur.role.role_permissions ?? []) {
          if (rp.permission?.name) permissions.add(rp.permission.name);
        }
      }
    }
  }

  return {
    id: user.id,
    email: user.email ?? "",
    profile: profile as Profile,
    roles,
    permissions: Array.from(permissions),
  };
}

/**
 * Get a public profile by user ID.
 */
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data as Profile;
}

/**
 * Upsert user profile (used after OAuth / registration).
 */
export async function upsertProfile(
  supabase: SupabaseClient,
  profile: Partial<Profile> & { id: string }
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ ...profile, updated_at: new Date().toISOString() } as any);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/**
 * Check if a user has a specific permission.
 * Pass the sessionUser object to avoid extra DB round-trips.
 */
export function hasPermission(
  sessionUser: SessionUser | null,
  permission: string
): boolean {
  if (!sessionUser) return false;
  if (sessionUser.roles.includes("super_admin")) return true;
  return sessionUser.permissions.includes(permission);
}

/**
 * Check if a user has any internal (team) role.
 * Used to guard access to team.siksatech.in
 */
export function isInternalUser(sessionUser: SessionUser | null): boolean {
  if (!sessionUser) return false;
  const internalRoles = [
    "super_admin",
    "ops_manager",
    "content_manager",
    "store_manager",
    "accounts_manager",
    "pr_manager",
    "support_staff",
  ];
  return sessionUser.roles.some((r) => internalRoles.includes(r));
}
