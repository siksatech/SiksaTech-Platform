-- ============================================================
-- Migration 014: Parent-Child Link RLS Policies and Security Definer RPCs
-- SiksaTech Platform
-- ============================================================

-- 1. Enable parent or child to UPDATE link (e.g. set verified = true)
DROP POLICY IF EXISTS "parent_child_update" ON public.parent_child_links;
CREATE POLICY "parent_child_update"
  ON public.parent_child_links FOR UPDATE
  USING (auth.uid() = parent_id OR auth.uid() = child_id)
  WITH CHECK (auth.uid() = parent_id OR auth.uid() = child_id);

-- 2. Enable parent or child to DELETE link (e.g. decline or unlink)
DROP POLICY IF EXISTS "parent_child_delete" ON public.parent_child_links;
CREATE POLICY "parent_child_delete"
  ON public.parent_child_links FOR DELETE
  USING (auth.uid() = parent_id OR auth.uid() = child_id);

-- 3. Ensure child can also insert/create link confirmation
DROP POLICY IF EXISTS "parent_child_insert_child" ON public.parent_child_links;
CREATE POLICY "parent_child_insert_child"
  ON public.parent_child_links FOR INSERT
  WITH CHECK (auth.uid() = parent_id OR auth.uid() = child_id);

-- 4. Security Definer RPC for Parent confirmation (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.confirm_parent_child_link(target_child_id UUID)
RETURNS JSONB AS $$
DECLARE
  curr_user_id UUID;
BEGIN
  curr_user_id := auth.uid();
  IF curr_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  INSERT INTO public.parent_child_links (parent_id, child_id, verified, created_at)
  VALUES (curr_user_id, target_child_id, true, now())
  ON CONFLICT (parent_id, child_id) DO UPDATE
  SET verified = true, created_at = now();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Security Definer RPC for Student approval (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.student_approve_parent_link(target_parent_id UUID)
RETURNS JSONB AS $$
DECLARE
  curr_user_id UUID;
BEGIN
  curr_user_id := auth.uid();
  IF curr_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  INSERT INTO public.parent_child_links (parent_id, child_id, verified, created_at)
  VALUES (target_parent_id, curr_user_id, true, now())
  ON CONFLICT (parent_id, child_id) DO UPDATE
  SET verified = true, created_at = now();

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
