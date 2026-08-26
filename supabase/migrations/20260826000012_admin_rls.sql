-- ============================================================
-- Migration 012: Admin RLS Bypass
-- SiksaTech Platform
-- ============================================================

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = required_role
  ) OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = required_role
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Now add super_admin ALL policies to all key tables
DO $$ 
DECLARE
  t TEXT;
BEGIN
  FOR t IN (
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
      AND tablename NOT IN ('roles', 'permissions', 'role_permissions')
  ) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "super_admin_bypass" ON public.' || quote_ident(t) || ';';
    EXECUTE 'CREATE POLICY "super_admin_bypass" ON public.' || quote_ident(t) || ' FOR ALL USING (public.has_role(''super_admin'')) WITH CHECK (public.has_role(''super_admin''));';
  END LOOP;
END $$;
