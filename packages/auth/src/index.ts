/**
 * @siksatech/auth — Main exports
 *
 * Server-side:
 *   import { createSupabaseServerClient, getServerSessionUser } from "@siksatech/auth";
 *
 * Client-side:
 *   import { createBrowserClient } from "@siksatech/database";
 *   (use the database package's browser client directly)
 *
 * Permission checks:
 *   import { hasPermission, isInternalUser } from "@siksatech/auth";
 */

// Server-side helpers
export {
  createSupabaseServerClient,
  getServerUser,
  getServerSessionUser,
} from "./server";

// Re-export permission utilities from database
export { hasPermission, isInternalUser } from "@siksatech/database";

// Re-export browser client for convenience
export { createBrowserClient, isRealSupabase } from "@siksatech/database";
