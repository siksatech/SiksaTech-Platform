-- ============================================================
-- Migration 001: Identity & Authorization Schema
-- SiksaTech Platform
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- PROFILES
-- One row per authenticated user. Extends Supabase auth.users.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT NOT NULL DEFAULT '',
  display_name     TEXT,
  avatar_url       TEXT,
  phone            TEXT,
  date_of_birth    DATE,
  gender           TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  bio              TEXT,
  city             TEXT,
  state            TEXT,
  country          TEXT NOT NULL DEFAULT 'India',
  website_url      TEXT,
  github_url       TEXT,
  linkedin_url     TEXT,
  is_public        BOOLEAN NOT NULL DEFAULT true,
  is_profile_complete BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- ROLES
-- Named internal platform roles.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────
-- PERMISSIONS
-- Granular resource.action strings.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL, -- e.g. 'courses.publish'
  description TEXT,
  module      TEXT NOT NULL          -- e.g. 'courses'
);

-- ─────────────────────────────────────────────────────────────
-- ROLE_PERMISSIONS
-- Many-to-many: roles ↔ permissions
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id       UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- ─────────────────────────────────────────────────────────────
-- USER_ROLES
-- Assigns platform-level roles to users.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id     UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- ─────────────────────────────────────────────────────────────
-- PARENT_CHILD_LINKS
-- Links parent accounts to student accounts.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.parent_child_links (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  verified   BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, child_id),
  CHECK (parent_id <> child_id)
);

-- ─────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_parent ON public.parent_child_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_child  ON public.parent_child_links(child_id);

-- ─────────────────────────────────────────────────────────────
-- AUTO-UPDATE updated_at
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─────────────────────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON NEW USER (Supabase trigger)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;

-- Profiles: public portfolios are readable by all; user can edit own
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);

CREATE POLICY "profiles_self_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Roles: readable by all authenticated users (needed for permission checks)
CREATE POLICY "roles_read_authenticated"
  ON public.roles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Permissions: readable by all authenticated users
CREATE POLICY "permissions_read_authenticated"
  ON public.permissions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Role permissions: readable by authenticated
CREATE POLICY "role_permissions_read_authenticated"
  ON public.role_permissions FOR SELECT
  USING (auth.role() = 'authenticated');

-- User roles: user can see own roles; admins see all via service role
CREATE POLICY "user_roles_self_read"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Parent-child: parent and child can see the link
CREATE POLICY "parent_child_read"
  ON public.parent_child_links FOR SELECT
  USING (auth.uid() = parent_id OR auth.uid() = child_id);

CREATE POLICY "parent_child_insert"
  ON public.parent_child_links FOR INSERT
  WITH CHECK (auth.uid() = parent_id);
