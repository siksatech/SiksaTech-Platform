/**
 * Database type definitions for SiksaTech.
 *
 * These types mirror the Supabase PostgreSQL schema.
 * They are used throughout the platform for type-safe queries.
 *
 * NOTE: This is a hand-written type file. Once the full schema is live,
 * run `supabase gen types typescript` to auto-generate and replace this.
 */

// ─────────────────────────────────────────────────────────────
// Identity & Auth
// ─────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string;
  website_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  is_public: boolean;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  label: string;
  description: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  module: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_by: string | null;
  assigned_at: string;
  // Joined fields
  role?: Role;
}

export interface ParentChildLink {
  id: string;
  parent_id: string;
  child_id: string;
  verified: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// Session / Auth Context (client-side representation)
// ─────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  profile: Profile;
  roles: string[]; // array of role names, e.g. ['super_admin']
  permissions: string[]; // array of permission names, e.g. ['courses.publish']
}

// ─────────────────────────────────────────────────────────────
// Supabase Database interface (used for createBrowserClient<Database>)
// ─────────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      roles: {
        Row: Role;
        Insert: Omit<Role, "id" | "created_at">;
        Update: Partial<Role>;
      };
      permissions: {
        Row: Permission;
        Insert: Omit<Permission, "id">;
        Update: Partial<Permission>;
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, "assigned_at" | "role">;
        Update: never;
      };
      parent_child_links: {
        Row: ParentChildLink;
        Insert: Omit<ParentChildLink, "id" | "created_at">;
        Update: Partial<ParentChildLink>;
      };
      [key: string]: {
        Row: any;
        Insert: any;
        Update: any;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
