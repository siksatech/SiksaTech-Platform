-- ============================================================
-- Development Seed Data
-- SiksaTech Platform
--
-- Run AFTER migrations. For development environment ONLY.
-- This creates a test super_admin user.
-- ============================================================

-- NOTE: You cannot directly insert into auth.users from SQL.
-- Create the test user via:
--   supabase auth signup --email admin@siksatech.dev --password Admin@1234
-- Then run this seed to grant them super_admin role.

-- Grant super_admin to a test user (replace the UUID with the actual auth user ID)
-- This is a placeholder — run after creating the user via Supabase dashboard or CLI.

-- Example (replace UUID):
-- INSERT INTO public.user_roles (user_id, role_id)
-- SELECT 
--   'YOUR-USER-UUID-HERE',
--   id
-- FROM public.roles
-- WHERE name = 'super_admin'
-- ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- Dev banner data
-- ─────────────────────────────────────────────────────────────
-- NOTE: The banners table doesn't exist yet (it will be added in a future migration).
-- Mock data is used as fallback in the meantime via DEMO_BANNERS.

SELECT 'Seed file ready. Create auth user first, then uncomment the INSERT above.' AS status;
