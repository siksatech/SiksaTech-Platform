-- Migration: Add missing UPDATE, DELETE, and child INSERT policies for parent_child_links
-- This enables parents to confirm links with OTP and students to approve/decline link requests

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
